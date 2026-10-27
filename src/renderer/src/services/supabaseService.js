import { supabase, isSupabaseConfigured } from '../lib/supabase';

export { isSupabaseConfigured };

/**
 * Supabase data adapter.
 *
 * Mirrors the mock service surface so the UI keeps reading from a single
 * service layer. Every method degrades gracefully: on error or empty data it
 * returns `null` so the caller can fall back to the mock dataset.
 */
export const supabaseService = {
  // 1. Fetch employees for the directory & sidebar.
  async getEmployees() {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase.from('employees').select('*');
    if (error) {
      console.error('[supabase] getEmployees', error);
      return null;
    }
    return data;
  },

  // 2. Fetch live telemetry + joined employee info for the map markers.
  async getLiveTelemetry() {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase
      .from('telemetry')
      .select(`
        id,
        latitude,
        longitude,
        status,
        updated_at,
        employees ( name, role, department )
      `);
    if (error) {
      console.error('[supabase] getLiveTelemetry', error);
      return null;
    }
    return data;
  },

  // 3. Save a clock-in punch with geolocation + timestamp.
  async recordAttendance(employeeId, lat, lng, isInsideGeofence) {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase
      .from('attendance')
      .insert([
        {
          employee_id: employeeId,
          clock_in: new Date().toISOString(),
          latitude: lat,
          longitude: lng,
          is_inside_geofence: isInsideGeofence,
          status: isInsideGeofence ? 'Present' : 'Outside Radius'
        }
      ])
      .select();
    if (error) {
      console.error('[supabase] recordAttendance', error);
      return null;
    }
    return data;
  },

  // 4. Fetch attendance log for the attendance page.
  //
  // Fetched as two plain queries (attendance + employees) and merged locally
  // instead of an embedded join: the employees table schema varies between
  // projects (optional columns like emp_id/avatar/geofence may not exist) and
  // a single missing column would fail the whole PostgREST request. Missing
  // employee fields degrade to the fallbacks in the row mappers.
  async getAttendance() {
    if (!isSupabaseConfigured()) return null;
    const [{ data, error }, employeesRes] = await Promise.all([
      supabase.from('attendance').select('*').order('clock_in', { ascending: false }),
      supabase.from('employees').select('*')
    ]);
    if (error) {
      console.error('[supabase] getAttendance', error);
      return null;
    }
    if (employeesRes.error) {
      console.error('[supabase] getAttendance (employees)', employeesRes.error);
    }
    const employeesById = new Map((employeesRes.data ?? []).map((emp) => [emp.id, emp]));
    return (data ?? []).map((row) => {
      const durationMinutes =
        row.duration_minutes ??
        (row.clock_in && row.clock_out
          ? Math.max(
              0,
              Math.round((new Date(row.clock_out) - new Date(row.clock_in)) / 60000)
            )
          : 0);
      return {
        ...row,
        duration_minutes: durationMinutes,
        employees: employeesById.get(row.employee_id) ?? null
      };
    });
  },

  // 5. Realtime subscription for live GPS updates.
  subscribeToLiveGPS(onUpdate) {
    if (!isSupabaseConfigured()) return null;
    return supabase
      .channel('public:telemetry')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'telemetry' }, (payload) => {
        onUpdate(payload.new);
      })
      .subscribe();
  },

  // 6. Office locations & geofence sites for the Location page.
  async getLocations() {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .order('code', { ascending: true });
    if (error) {
      console.error('[supabase] getLocations', error);
      return null;
    }
    return data;
  }
};
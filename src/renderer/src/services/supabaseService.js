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
    const { data, error } = await supabase.from('employees').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('[supabase] getEmployees', error);
      return null;
    }
    return data;
  },

  async createEmployee(input) {
    if (!isSupabaseConfigured()) return null;
    const id = input.id ?? `EMP-${Date.now()}`;
    const payload = {
      id,
      emp_id: input.emp_id ?? id,
      name: input.name ?? 'New Employee',
      email: input.email ?? '',
      rfid_token: input.rfid_token ?? `RFID-${id}`,
      department: input.department ?? 'General',
      role: input.role ?? 'Field Operator',
      geofence: input.geofence ?? 'Kolam Renang Tirta Mulya',
      attendance_status: input.attendance_status ?? 'present',
      attendance_time: input.attendance_time ?? 'Registered Today',
      location_state: input.location_state ?? 'online',
      location_detail: input.location_detail ?? 'Online (Enrolled)',
      last_ping: input.last_ping ?? 'Just now',
      avatar: input.avatar ?? '',
      gps_lat: input.gps_lat ?? null,
      gps_lng: input.gps_lng ?? null,
      gps_accuracy: input.gps_accuracy ?? null,
      distance_meters: input.distance_meters ?? null,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase.from('employees').insert([payload]).select().single();
    if (error) {
      console.error('[supabase] createEmployee', error);
      return null;
    }
    return data;
  },

  async updateEmployee(id, input) {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase
      .from('employees')
      .update({
        emp_id: input.emp_id ?? id,
        name: input.name ?? undefined,
        email: input.email ?? undefined,
        department: input.department ?? undefined,
        role: input.role ?? undefined,
        geofence: input.geofence ?? undefined,
        attendance_status: input.attendance_status ?? undefined,
        attendance_time: input.attendance_time ?? undefined,
        location_state: input.location_state ?? undefined,
        location_detail: input.location_detail ?? undefined,
        last_ping: input.last_ping ?? undefined,
        avatar: input.avatar ?? undefined,
        gps_lat: input.gps_lat ?? undefined,
        gps_lng: input.gps_lng ?? undefined,
        gps_accuracy: input.gps_accuracy ?? undefined,
        distance_meters: input.distance_meters ?? undefined,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[supabase] updateEmployee', error);
      return null;
    }
    return data;
  },

  async deleteEmployee(id) {
    if (!isSupabaseConfigured()) return false;
    const { error } = await supabase.from('employees').delete().eq('id', id);
    if (error) {
      console.error('[supabase] deleteEmployee', error);
      return false;
    }
    return true;
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
  },

  // 6b. Same read as getLocations, but keeps the error visible.
  // getLocations swallows failures (null == empty for the caller), which would
  // make the Bulk Geofence Sync toast claim success while the server actually
  // errored (e.g. missing table). Returns `{ data, error }` instead.
  async getLocationsDetailed() {
    if (!isSupabaseConfigured()) {
      return { data: null, error: { message: 'Supabase is not configured.' } };
    }
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .order('code', { ascending: true });
    if (error) {
      console.error('[supabase] getLocationsDetailed', error);
      return { data: null, error };
    }
    return { data, error: null };
  },

  // 7. Insert a new office location (Location page — Save Location).
  //
  // Unlike the fetch helpers above, this returns `{ data, error }` instead of
  // swallowing the failure: the caller must show the real server message so a
  // failed save is never reported as a success (e.g. missing table / RLS 42501
  // / duplicate code).
  async insertLocation(payload) {
    if (!isSupabaseConfigured()) {
      return { data: null, error: { message: 'Supabase is not configured.' } };
    }
    const { data, error } = await supabase.from('locations').insert([payload]).select().single();
    if (error) {
      console.error('[supabase] insertLocation', error);
      return { data: null, error };
    }
    return { data, error: null };
  },

  // 8. Update an existing office location (edit form, status toggle).
  // Same `{ data, error }` contract as insertLocation.
  async updateLocation(id, patch) {
    if (!isSupabaseConfigured()) {
      return { data: null, error: { message: 'Supabase is not configured.' } };
    }
    const { data, error } = await supabase
      .from('locations')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.error('[supabase] updateLocation', error);
      return { data: null, error };
    }
    return { data, error: null };
  }
};
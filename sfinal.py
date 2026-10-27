from playwright.sync_api import sync_playwright
import json
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    pg = b.new_page(viewport={'width':1600,'height':900})
    errors = []
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' and '401' not in m.text and 'supabase' not in m.text else None)
    def locations(route):
        body = json.dumps([{'id':'x1','code':'HQ-01','name':'Testing HQ','category':'Primary Core','address':'Jl Test 7','zone':'ID-JKT','icon':'domain','staff_count':64,'radius_meters':250,'status':'active','last_ping_at':'2026-10-27T08:30:00Z','ping_ms':14}])
        route.fulfill(status=200, headers={'access-control-allow-origin':'*','content-type':'application/json'}, body=body)
    def employees(route):
        body = json.dumps([{'id':'e1','emp_id':'EMP-8801','name':'Test Weber','email':'t@x.io','department':'Ops','role':'Operator','geofence':'HQ','attendance_status':'present','location_state':'online','avatar':'','gps_lat':-6.2,'gps_lng':106.8,'distance_meters':12}])
        route.fulfill(status=200, headers={'access-control-allow-origin':'*','content-type':'application/json'}, body=body)
    def attendance(route):
        body = json.dumps([{'id':'a1','employee_id':'e1','clock_in':'2026-10-27T01:02:00Z','clock_out':'2026-10-27T09:50:00Z','is_inside_geofence':True,'status':'Present','duration_minutes':528}])
        route.fulfill(status=200, headers={'access-control-allow-origin':'*','content-type':'application/json'}, body=body)
    def telemetry(route):
        body = json.dumps([])
        route.fulfill(status=200, headers={'access-control-allow-origin':'*','content-type':'application/json'}, body=body)
    pg.route('**/rest/v1/**', telemetry)
    pg.route('**/rest/v1/locations**', locations)
    pg.route('**/rest/v1/employees**', employees)
    pg.route('**/rest/v1/attendance**', attendance)
    shots = [('','home'),('attendance','attendance'),('employees','employees'),('live-monitoring','livemon'),('location','location'),('reports','reports'),('settings','settings')]
    for route, name in shots:
        pg.goto(f'http://127.0.0.1:4186/#/{route}', wait_until='networkidle')
        pg.wait_for_timeout(3200)
        pg.screenshot(path=f'C:/Users/HP/AppData/Local/Temp/opencode/shots2/fin-{name}.png')
    print('console errors (non-401):', errors[:6])
    b.close()

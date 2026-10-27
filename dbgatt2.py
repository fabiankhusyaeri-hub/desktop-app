import re, sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
src = open('src/renderer/src/services/attendanceService.ts', encoding='utf-8').read()
i = src.find('const fetchFromSupabase')
print(src[i:i+1400])

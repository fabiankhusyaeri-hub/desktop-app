import re, sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
src = open('src/renderer/src/services/attendanceService.ts', encoding='utf-8').read()
# find functions that build meta
for m in re.finditer(r'(?:const|function)\s+(\w+)\s*=?\s*(async)?\(?:', src):
    pass
i = src.find('workHoursLogged')
print(src[max(0,i-2600):i+500][-3200:])

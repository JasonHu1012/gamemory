names = open('names.txt', 'r')
temp = open('temp.txt', 'r')
names_list = []
temp_list = []
while True:
    s = names.readline()
    if not s:
        break
    names_list.append(s[:-1])
while True:
    s = temp.readline()
    if not s:
        break
    temp_list.append(s[:-1])
seen = set()
for i in names_list:
    seen.add(i)
for i in temp_list:
    seen.add(i)
names.close()
temp.close()
names = open('names.txt', 'w')
for i in seen:
    print(i, file=names)
js = open('allnames.js', 'w')
print('const allNames = [', file=js)
count = 1
for i in seen:
    print('  "' + i + '"', file=js, end=',\n' if count != len(seen) else '\n')
    count += 1
print(']', file=js)
print('const totalName = ' + str(count) +';', file=js)
js.close()
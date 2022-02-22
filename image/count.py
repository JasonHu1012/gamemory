import os

path = "pic/"
allfile = os.listdir(path)
allfile.sort()
output = ""
skip = ["blank.jpg", "temp", ".DS_Store"]
print("const categoryNum = {")
for i in range(len(allfile)):
    if allfile[i] in skip:
        continue
    l = os.listdir(path + allfile[i])
    c = len(l)
    for j in l:
        if j[-4:] != ".jpg":
            c -= 1
    output += "  " + allfile[i] + ": " + str(c)
    output += ",\n"
print(output[: -2])
print("};")

from PIL import Image
import imagehash
import os

seen = {}
path = "pic/"
images = os.listdir(path)
total = len(os.listdir(path))
for i in images:
    if i[-4:] != ".jpg":
        total -= 1
i = 0
while i < total:
    h = imagehash.phash(Image.open(path + str(i) + ".jpg"))
    if h not in seen:
        seen[h] = []
    seen[h].append(i)
    if len(seen[h]) > 1:
        for j in range(len(seen[h]) - 1):
            if os.popen("diff " + path + str(seen[h][j]) + ".jpg " + path + str(i) + ".jpg").read() == "":
                print(seen[h][j], i, "are the same")
                os.system("mv " + path + str(total - 1) + ".jpg " + path + str(seen[h][j]) + ".jpg")
                total -= 1
    print(i)
    i += 1
print("remove all duplicate images")
js = open('facenum.js', 'w')
print('const totalFace = ' + str(total) + ';', file=js)
print('update facenum.js')

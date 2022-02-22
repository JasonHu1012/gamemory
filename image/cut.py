from PIL import Image
import os

path_from = "pic/temp/"
path_to = "pic/" + input("category: ") + "/"
allfile = os.listdir(path_from)
l = os.listdir(path_to)
count = len(l)
for i in l:
    if i[-4:] != ".jpg":
        count -= 1
for i in range(len(allfile)):
    try:
        img = Image.open(path_from + allfile[i])
        width = img.size[0]
        height = img.size[1]
        if width > height:
            d = (width - height) // 2
            box = (d, 0, width - d, height)
        else:
            d = (height - width) // 2
            box = (0, d, width, height - d)
        img.crop(box).resize((1000, 1000)).save(path_to + str(count) + ".jpg")
        print(count)
        count += 1
    except:
        continue
print("images are cut and numbered")

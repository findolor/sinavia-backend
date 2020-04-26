file = open('./text2.txt', 'r')
new = open('./news.txt', 'w+')

contents = file.read()

for k in contents:
    if k == '%':
        new.write('\n')
    else:
        new.write(k)
    """ for idx, i in enumerate(split):
        if i == '':
            new.write('\n')
        else:
            new.write(i) """

""" for i in contents:
    string = i[:-1]
    new.write(string + ' ') """


""" file = open('./text2.txt', 'r')
new = open('./news.txt', 'w+')

contents = file.read()

line = ''

for i in contents:
    if i == '%':
        new.write(line + '\n')
        line = ''
    else:
        line += i """
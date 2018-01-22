#!/usr/bin/env python
# -*- coding: utf-8 -*-
import csv
# {'attribute':[feature labels], "subject#i-code":[feature list]}
subjectfeatureList = {}
# get list of subject and its feature

# get student and match to data
dataList = []


def readScoreCsvMatrix(filename, delimiter):
    header, matrix = readCsvFile(filename, delimiter)
    score_matrix = []
    for row in matrix:
        for i in range(4, len(row)):
            # r = row[i].replace('-', ".")  # split to array of rates
            r = row[i]
            r = r.split('-')
            row[i] = r[-1]
        score_matrix.append(row)
   # print score_matrix
    return (header, score_matrix)


def readWhenstudy(filename, delimiter):
    header, matrix = readCsvFile(filename, delimiter)
    senmester_matrix = []
    # count=1
    for row in matrix:
        for i in range(5, len(row)):
            if(row[i] != '?' and row[i] != '' and row[i] != " "):
                r = row[i].replace('-', ".")  # split to array of rates
                r = r.split('.')
                row[i] = r[-3:]
            else:
                row[i] = '?'
       # print row
        # row[i] = data[-1]  # get the last rate
        maxyear = 1000
        minyear = 10000
        for i in range(5, len(row)):
            if row[i] != '?':
                # print row[i]
                maxyear = max(maxyear, int(row[i][-1]))
                minyear = min(minyear, int(row[i][-1]))
        for i in range(5, len(row)):
            if row[i] != '?':
                sen = (int(row[i][-1]) - minyear) * 2 + \
                    int(row[i][0])  # senmester
                row[i] = sen
                # print row[i]
                # count=count+1
        senmester_matrix.append(row)
    # print count
    return (header, senmester_matrix)
    # print ";".join(row)


def readSubjectFeatureToDictionary(filename, delimit):
    header, matrix = readCsvFile(filename, delimit)
    subjectFeatureDict = {}  # key is ma mon hoc
    header = header[2:]
    for row in matrix:
        subjectFeatureDict[row[0].strip().rstrip().lstrip()] = []
        for i in range(2, len(row)):
            subjectFeatureDict[row[0].strip().rstrip().lstrip()].append(row[i].strip().rstrip().lstrip())
    return (header, subjectFeatureDict)


def readCsvFile(filename, delimit):
    # return header[](the first row) and the data matrix [][] (the rest)
    with open(filename, 'rb') as csvfile:
        reader = csv.reader(csvfile, delimiter=delimit, quotechar='"')
        header = []
        matrix = []
        list_blank_items = []
        for row in reader:
            for i in range(0, len(row)):
                if row[i] == "" or row[i] == " ":
                    list_blank_items.append(i)  # find blank column
                pop = 0
            for index in list_blank_items:
                row.pop(index - pop)
                pop = pop + 1
            header = row
            break
        for row in reader:
            pop = 0
            for index in list_blank_items:
                row.pop(index - pop)
                pop = pop + 1
            for i in range(0, len(row)):
                if row[i] == ""or row[i] == " ":              # ? as blank cell
                    row[i] = '?'
            matrix.append(row)
        # print matrix
        return (header, matrix)


def readCsvFileToDictionary(filename, delimit):
    # return data dictionary in column with key is the header of column
    with open(filename, 'rb') as csvfile:
        reader = csv.reader(csvfile, delimiter=delimit, quotechar='|')
        datadict = {}
        header = []
        list_blank_items = []
        for row in reader:
            for i in range(0, len(row)):
                if row[i] == "" or row[i] == " ":
                    list_blank_items.append(i)  # find blank column
                pop = 0
            for index in list_blank_items:
                row.pop(index - pop)

                pop = pop + 1
            header = row
            break
        for row in reader:
            pop = 0
            for index in list_blank_items:
                row.pop(index - pop)
                pop = pop + 1
            for i in range(0, len(row)):
                # ? as blank cell
                if row[i] == "" or row[i] == " ":
                    row[i] = '?'
                # to get last score
                r = row[i]
                r = r.split('-')
                row[i] = r[-1]
            for i in range(0, len(row)):
                if not datadict.has_key(header[i]):
                    datadict[header[i]] = []
                datadict[header[i]].append(row[i])
        return datadict


def CGPA(scores,semester):
    sum=0
    total=0.00000001
    for score in scores:
        # try:
        if float(score[1]) < float(semester):
            sum+=float(score[0])
            total+=1
        # except Exception:
        #     print score[0].strip().rstrip().lstrip(),score,semester
    return sum/total
def GPA(scores,semester):
    sum=0
    total=0.00000001
    for score in scores:
        # try:
        if score[1] == semester - 1:
            sum+=float(score[0])
            total+=1
        # except Exception:
        #     print score[0].strip().rstrip().lstrip(),score,semester
    return sum/total

def customIntParse(string):
    try:
        return int(string)
    except Exception:
        return False
def creatData():
    header,score_matrix = readScoreCsvMatrix("out_DIEM_v.7.txt", ';')
    #header : info + mã môn học
    #score_matrix : info + điểm môn học
    timeheader,time_matrix = readWhenstudy("out_TIME_special_v.7.txt", ";")
    #header : info + mã môn học
    #score_matrix : info + học kỳ học
    feature_header,feature_dict = readSubjectFeatureToDictionary("UOCLUONGTHUOCTINH.csv", ",")
    # feature_header: tên feature: thừa trường môn tiên quyết
    # feature_dict: mã môn học-->feature values


    montienquet_index = feature_header.index('MONTIENQUYET')
    # feature_header.pop(montienquet_index)
    allData={}
    studentMaxSemester={}
    for row_num in range(len(score_matrix)):
        studentCode=score_matrix[row_num][0].strip().rstrip().lstrip()
        if not studentMaxSemester.has_key(studentCode):
            studentMaxSemester[studentCode]=1
        ##score+semester
        for i in range(5,len(header)):
            subjectCode=header[i].strip().rstrip().lstrip()
            if not feature_dict.has_key(subjectCode):
                print "Chua co thuoc tinh cua mon hoc: ",subjectCode
                continue
            # print studentCode,subjectCode
            allData[(studentCode,subjectCode)]={}
            allData[(studentCode,subjectCode)]["score"]=score_matrix[row_num][i]
            if customIntParse(time_matrix[row_num][i]):
                studentMaxSemester[studentCode]=max(customIntParse(time_matrix[row_num][i])+1,studentMaxSemester[studentCode])
            allData[(studentCode,subjectCode)]["semester"]=time_matrix[row_num][i]
            allData[(studentCode,subjectCode)]["gender"]=score_matrix[row_num][3]
            for field in feature_header:
                allData[(studentCode,subjectCode)][field]=feature_dict[subjectCode][feature_header.index(field)]


    for key in allData:
        montienquyet=allData[key]["MONTIENQUYET"]
        if  montienquyet is '?' or montienquyet is "" or montienquyet==" ":
            allData[key]["MONTIENQUYET"]=0
            continue
        cac_mon_tien_quyet=montienquyet.split('-')
        tong_diem_tien_quyet=0
        for tien_quyet in cac_mon_tien_quyet:
            if allData.has_key((key[0],tien_quyet.strip().rstrip().lstrip())):
                score=allData[(key[0],tien_quyet.strip().rstrip().lstrip())]['score']
                if score != '?' and score != "" and score != " ":
                    tong_diem_tien_quyet+= float(score)
        allData[key]["MONTIENQUYET"]= tong_diem_tien_quyet/len(cac_mon_tien_quyet)


    scanedStudent=[]
    for key in allData:
        if key[0] in scanedStudent:
            continue
        else:
            scanedStudent.append(key[0])
            oneStudentDict = {k: v for k, v in allData.items() if k[0]== key[0]}
            scores=[(v["score"],v["semester"]) for k, v in oneStudentDict.items() if v["score"] != "?" and v["score"]!=" " and v["score"]!=""]
            for studentKey in oneStudentDict:
                item=allData[studentKey]
                if item["score"] == "?" or item["score"]==" " or item["score"]=="":
                    semester=studentMaxSemester[studentKey[0]]
                    allData[studentKey]["semester"]=semester
                else:
                    semester=allData[studentKey]["semester"]
                try:
                    allData[studentKey]['CGPA']=CGPA(scores,semester)
                    allData[studentKey]['GPA']=GPA(scores,semester)
                except Exception:
                    print "data khong dung form tai", studentKey[0]
    return allData



#####compute feature
data= creatData()
train = {k: v for k, v in data.items() if v["score"] != "?" and v["score"]!=" " and v["score"]!=""}
test = {k: v for k, v in data.items() if v["score"] == "?"}


gender = ['nam', 'nữ']
CHUYEN_NGANH = ['ALL', 'CNTT', 'DTVT']
LOAI_MON = ['KHOI_KIEN_THUC_CHUNG', 'KHOI_KIEN_THUC_CHUNG_THEO_LINH_VUC', 'KHOI_KIEN_THUC_CHUNG_CNTT_DTVT',
            'KHOI_KIEN_THUC_CHUNG_NHOM_NGANH', 'KHOI_KIEN_THUC_NGANH_BATBUOC', 'KHOI_KIEN_THUC_NGANH_BOTRO', 'MON_TU_CHON']
BAITAPNHOM = ['y', 'n']
HINHTHUCTHI = ['V', 'TH', 'VD', 'TN']

zeroposition = ['Nam', 'ALL', 'KHOI_KIEN_THUC_CHUNG',
                'KHONGCAN', 'y', 'V', '0', '0.0','0']


def is_number(s):
    try:
        float(s)
        return True
    except ValueError:
        return False


def element_value(s):
    if is_number(s):
        return s
    else:

        if s == 'nam' or s== 'Nam':
            return 0
        if s == 'Nữ' or s=='nữ':
            return 1
            # return gender.index(s)
        if s in CHUYEN_NGANH:
            return CHUYEN_NGANH.index(s)
        if s in LOAI_MON:
            return LOAI_MON.index(s)
        if s in BAITAPNHOM:
            return BAITAPNHOM.index(s)
        if s in HINHTHUCTHI:
            return HINHTHUCTHI.index(s)
    return 0

def instanceinform(element):
    target = element['score']
    output = str(target)
    output += ' '
    count=0
    for i in element:
        if i != "score":
            count+=1
        if element[i] not in zeroposition and i !="score"  and element_value(element[i]) != 0:
            output = output + str(count) + ':' + \
                str(element_value(element[i])) + ' '
    return output

def instanceinformTest(element):
    output = '0 '
    count=0
    for i in element:
        if i != "score":
            count+=1
        if element[i] not in zeroposition and i !="score"  and element_value(element[i]) != 0:
            output = output + str(count) + ':' + \
                str(element_value(element[i])) + ' '
    return output



# element= {'MONTIENQUYET': 0, 'GIO_LYTHUYET': '21', 'HINHTHUCTHI': 'V', 'HOCTHUOC': '10', 'gender': 'Nam', 'DOKHOMH': '8', 'LOAI_MON': 'KHOI_KIEN_THUC_CHUNG', 'GPA': 5.893333313688889, 'KNLAPTRINH': '0', 'GIO_THUCHANH': '5', 'semester': 4, 'score': '6.7', 'TIENGANH': '0', 'KTTOAN': '0', 'CGPA': 5.696666657172222, 'CHUYEN_NGANH': 'ALL', 'BAITAPNHOM': 'y'}
count =0
fo = open("train.dat", "wb")
for element in train:
    fo.write(instanceinform(train[element]) + '\n')
fo.close()

# fo = open("test.dat", "wb")
# fo2= open("testIndicate.txt","wb")
# for element in test:
#     fo2.write(element[0]+','+element[1]+'\n')
#     fo.write(instanceinformTest(test[element]) + '\n')
# fo.close()
# fo2.close()
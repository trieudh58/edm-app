
function boltLoadingGlobal() {
    window.boltLoading = window.pleaseWait({
        logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGP6zwAAAgcBApocMXEAAAAASUVORK5CYII=',
        backgroundColor: '#2980b9',
        loadingHtml: '<div class="loader1" style="position: absolute"></div>'
    });
}


function subjectDictViet(subjectJsonData) {
    result = {}
    for (i = 0; i < subjectJsonData.length; i++) {
        result[subjectJsonData[i].code] = subjectJsonData[i].name.vi;
    }
    return result;
}
function subjectDictEng(subjectJsonData) {
    result = {}
    for (i = 0; i < subjectJsonData.length; i++) {
        result[subjectJsonData[i].code] = subjectJsonData[i].name.en;
    }
    // console.log(result);
    return result;
}
function subjectCredit(subjectJsonData) {
    result = {}
    for (i = 0; i < subjectJsonData.length; i++) {
        result[subjectJsonData[i].code] = subjectJsonData[i].details.credits;
    }
    return result;
}
function studentRecordInSenmester(records) {
    result = {};
    for (i = 0; i < records.length; i++) {
        var semester = records[i].attempt[records[i].attempt.length - 1].semester;
        if (semester in result) {
            result[semester].push({
                subjectCode: records[i].subjectCode,
                score: records[i].attempt[records[i].attempt.length - 1].score,
                score4: studentRecord4(records[i].attempt[records[i].attempt.length - 1].score),
                scoreChar: studentRecordChar(studentRecord4(records[i].attempt[records[i].attempt.length - 1].score))
            });
        }
        else {
            result[semester] = [];
            result[semester].push({
                subjectCode: records[i].subjectCode,
                score: records[i].attempt[records[i].attempt.length - 1].score,
                score4: studentRecord4(records[i].attempt[records[i].attempt.length - 1].score),
                scoreChar: studentRecordChar(studentRecord4(records[i].attempt[records[i].attempt.length - 1].score))
            });
        }
    }
    // console.log(result['1.2014-2015'][1]);
    return getSortedKeys(result);
}

function getSortedKeys(recordsDict) {
    result={}
    var keys = []; for(var key in recordsDict){
        keys.push(key);
    }
    keys.sort(function(a,b){return a-b});  //Change compare function when semester not a number
    for(var i in keys){
        result[" " +keys[i]]= recordsDict[keys[i]]
    }
    return result;
}

function GPASemesterList(records, credits) {
    result = [];
    for (var key in records) {
        result.push(semesterGPA(records[key], credits));
    }
    result = [result];
    return result;
}

function semesterGPA(records, credits) {
    var totalCredits = 0.0;
    var totalScore4 = 0.0;
    var credit = 0;
    var score = 0.0;
    for (i = 0; i < records.length; i++) {
        var score = records[i].score4;
        var subjectCode = records[i].subjectCode;
        if (subjectCode in credits && score !== 0) {                       //if subjectCode exist
            credit = credits[records[i].subjectCode];
            totalCredits += credit;
            totalScore4 += score * credit;
        }
    }
    var result = totalScore4 / totalCredits;
    return Number(Math.round(result + 'e2') + 'e-2');
}
function listSemester(records) {
    var keys = []
    for (var key in records) keys.push(key);
    return keys;
}

function studentRecord4(score) {
    if (score >= 9)
        return 4.0;
    if (score >= 8.5)
        return 3.7;
    if (score >= 8.0)
        return 3.5;
    if (score >= 7.0)
        return 3.0;
    if (score >= 6.5)
        return 2.5;
    if (score >= 5.5)
        return 2.0;
    if (score >= 5.0)
        return 1.5;
    if (score >= 4.0)
        return 1.0;
    return 0
}
function studentRecordChar(score) {
    if (score == 4.0)
        return 'A+';
    if (score == 3.7)
        return 'A';
    if (score == 3.5)
        return 'B+';
    if (score == 3.0)
        return 'B';
    if (score == 2.5)
        return 'C+';
    if (score == 2.0)
        return 'C';
    if (score == 1.5)
        return 'D+';
    if (score == 1.0)
        return 'D';
    if (score == 0)
        return 'F';

}

function getStudyPathDict(data, subjectName) {
    result = {};
    for (i = 0; i < data.length; i++) {
        var semester = data[i].semester;
        if (semester in result) {
            result[semester].push({'subjectCode': data[i].subject, 'subjectName': subjectName[data[i].subject]});
        }
        else {
            result[semester] = [];
            result[semester].push({'subjectCode': data[i].subject, 'subjectName': subjectName[data[i].subject]});
        }
    }
    return result;
}

function educationProgramsDict(program, ku) {
    result = {};
    for (i = 0; i < program.length; i++) {
        result[ku[i].name] = program[i].subjects;
    }
    return result;
}

function convertSubjectCodeArray(array) {
    var result = [];

    for (i = 0; i < array.length; i++) {
        result.push({
            'i': i+1,
            'code': array[i].code,
            'name': array[i].name.vi + ' (' + array[i].name.en + ')',
            'credits': array[i].details.credits,
        });
    }
    return result;
}

function convertPostArray(array) {
    var result = [];

    for (i = 0; i < array.length; i++) {
        result.push({
            'i': i+1,
            '_id': array[i]._id,
            'header': array[i].header,
            'createdAt': array[i].createdAt,
            'body': array[i].body,
        });
    }
    return result;
}

function convertEpsArray(array) {
    var result = [];

    for (i = 0; i < array.length; i++) {
        result.push({
            'i': i+1,
            'code': array[i].code,
            'name': array[i].name,
            'totalCredits': array[i].totalCredits,
        });
    }
    return result;
}

function convertTimetableArray(array) {
    var result = [];

    for (i = 0; i < array.length; i++) {
        result.push({
            'i': i+1,
            'code': array[i].subject.code,
            'name': array[i].subject.name.vi + ' ('+array[i].subject.name.en+')',
            'details': array[i].subject.details,
            'classCode': array[i].classCode,
            'theory': array[i].theory,
            'practice': array[i].practice,
        });
    }
    return result;
}

function convertSubjectIdArray(subjects) {
    var result = [];

    for (i = 0; i < subjects.length; i++) {
        result.push({'value': subjects[i]._id, 'label': subjects[i].name.vi + ' - ' + subjects[i].name.en});
    }
    return result;
}

function convertLecturerCodeArray(lecturers) {
    var result = [];

    for (i = 0; i < lecturers.length; i++) {
        result.push({'value': lecturers[i].lecturerCode, 'label': lecturers[i].name});
    }
    return result;
}

function convertRecommendationScoreArray(array) {
    var result = [];

    for (i = 0; i < array.length; i++) {
        result.push({
            'i': i+1,
            'code': array[i].code,
            'name': array[i].name.vi,
            'credits': array[i].details.credits,
            'prerequisite': 'N/A',
        });
    }
    return result;
}

function convertLecturerInfoArray(array) {
    var result = [];

    for (i = 0; i < array.length; i++) {
        result.push({
            'i': i+1,
            'lecturer': array[i].degree + array[i].lecturer,
            'workplace': array[i].workplace,
            'thesisGuide': array[i].thesisGuide,
            'study': array[i].study,
            'teach': array[i].teach,
        });
    }
    return result;
}

function convertNotificationArray(array) {
    var result = [];

    for (i = 0; i < array.length; i++) {
        result.push({
            'isRead': array[i].isRead,
            'isImportant': array[i].isImportant,
            'title': array[i].notification.title,
            'creator': array[i].notification.creator.email,
            'updatedAt': array[i].notification.updatedAt,
            '_id': array[i].notification._id,
        });
    }
    return result;
}

function convertSrdArray(array) {
    var result = [];

    for (i = 0; i < array.length; i++) {
        result.push({
            'i': i+1,
            'supervisor': array[i].supervisor,
            'studyField': array[i].studyField,
            'topics': array[i].topics,
        });
    }
    return result;
}

function convertLecturersArray(lecturers) {
    var result = [];

    for (i = 0; i < lecturers.length; i++) {
        result.push({'id': lecturers[i].lecturer, 'title': lecturers[i].lecturer});
    }
    return result;
}

function expectedTimeArray() {
    var result = [
        {'value': 'Morning', 'label': 'Buổi sáng'},
        {'value': 'Afternoon', 'label': 'Buổi chiều'},
        {'value': 'Evening', 'label': 'Buổi tối'},
    ];
    return result;
}

function checkJoined(joiners,creatorId) {

    for (i = 0; i < joiners.length; i++) {
        if(joiners[i].joiner == creatorId) return 1;
    }

    return 0;
}

function convertTagsArray(array) {
    var result = [];

    for (i = 0; i < array.length; i++) {
        result.push({'text': array[i]});
    }
    return result;
}

function convertTagsObject(array) {
    var result = '';

    for (i = 0; i < array.length; i++) {
        if (array[i].text.length>0) result += array[i].text;
        if (i < array.length -1) result += ',';
    }
    return result;
}

function apiError(response) {
    console.log(response);
    if (response.data.message == 'TokenExpiredError') {
        location.reload();
        $.jGrowl('Phiên làm việc đã hết hạn', {
            header: 'Thông báo!',
            theme: 'alert-styled-left bg-warning',
            position: 'bottom-right'
        });
    } else {
        $.jGrowl('Đã có lỗi xảy ra: ' + response.data.message, {
            header: 'Thông báo!',
            theme: 'alert-styled-left bg-warning',
            position: 'bottom-right'
        });
    }
}

function statusBarData(educationProgramDetails,knowledgeUnitDetails,studentRecords,credits){
    /**
    *   status bar data is a dictionary using knowledge unit code as key
    *   each contain: knowledge unit name, total credits, total studyed credits.
    **/
    var statusBarData={};
    var studiedSubjects=[];
    var ku = null;

    for(var i in studentRecords){
        studiedSubjects.push(studentRecords[i].subjectCode)
    };
    for(var i in educationProgramDetails){
        ku= educationProgramDetails[i].kuCode;
        statusBarData[ku]={};
        statusBarData[ku]["totalCredits"]=educationProgramDetails[i].totalCreditsByKU;
        statusBarData[ku]["studiedCredits"]=0;
        var subjects = educationProgramDetails[i].subjects;
        for(var j in subjects){
            if(studiedSubjects.indexOf(subjects[j])>-1){
                statusBarData[ku]["studiedCredits"]+=credits[subjects[j]]
            }
            else{
            }
        }
    };

    for( var i in knowledgeUnitDetails){
        ku = knowledgeUnitDetails[i].kuCode;
        if(ku in statusBarData){
            statusBarData[ku].name=knowledgeUnitDetails[i].name;
        }
        else{
        }
    }
    return statusBarData;
}

function timeTableData(timetable){
    var classDict=[]
    for(var i in timetable){
        var practiceGroup=timetable[i].practice;
        classDict.push({
                "i":i*1+1,
                "disable": practiceGroup.length? true: false,
                "theory": true,
                "name":timetable[i].subject.name.vi+'(LT)',
                "classCode":timetable[i].classCode,
                "weekday":convertWeekday(timetable[i].theory.classTime.weekday),
                "time": convertClassTime(timetable[i].theory.classTime.session),
                "auditorium":timetable[i].theory.auditorium,
                "credits":timetable[i].subject.details.credits,
                "studentLimitation":"N/A",
                "lecturer": timetable[i].theory.lecturer
            });

        var practiceGroup=timetable[i].practice;
        for(var j in practiceGroup){
            classDict.push(
                {
                    "i":i*1+1,
                    "name":timetable[i].subject.name.vi+'(TH)',
                    "disable": false,
                    "theory": false,
                    "groupId":practiceGroup[j].groupId,
                    "classCode":timetable[i].classCode,
                    "weekday":convertWeekday(practiceGroup[j].classTime.weekday),
                    "time": convertClassTime(practiceGroup[j].classTime.session),
                    "auditorium":practiceGroup[j].auditorium,
                    "credits":timetable[i].subject.details.credits,
                    "studentLimitation":"N/A",
                    "lecturer": practiceGroup[j].lecturer
                }
            )
        }
        
    }
    return classDict
}

function convertClassTime(session){

    var startTime=['00:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00'];
    var endTime=['00:00','07:50','08:50','09:50','10:50','11:50','12:50','13:50','14:50','15:50','16:50','17:50','18:50','19:50','20:50','21:50'];
    return {
        "start":startTime[session.start],
        "end":endTime[session.end]
    }
}

function timTableFilter(element){

}

function personalTimeTable(classCodeList,timeTableData) {
    result={
        "Thứ 2":[],
        "Thứ 3":[],
        "Thứ 4":[],
        "Thứ 5":[],
        "Thứ 6":[],
        "Thứ 7":[]
        // "Chủ nhật":[]
    };
    for(var i in classCodeList){
        var classInfo = timeTableData.filter(x => x.classCode === classCodeList[i].classCode)
        for( var j in classInfo){
            if(classInfo[j].theory){
                result[classInfo[j].weekday].push(classInfo[j]);
            }
            else if(classInfo[j].groupId === classCodeList[i].groupId){
                result[classInfo[j].weekday].push(classInfo[j]);
            }
        }
    }
    return result
}

function convertWeekday(weekday){
    if(weekday>5)
        return "Chủ nhật"
    return "Thứ "+(parseInt(weekday)+2)
}

function surveySubmitAnswer(formdata,dataQuestions){
    result=[]
    formType=["checkboxes","date","multipleChoices","tags","time"];
    for(key in formdata){
        if(key=="checkboxes"){
            for(key2 in formdata["checkboxes"]){
                var answers=[]
                for(key3 in formdata["checkboxes"][key2]){
                    answers.push(dataQuestions.find(x => x._id === key2).choices[key3]);
                }
                result.push({
                    "questionId":key2,
                    "chosenAnswers":answers
                })
            }
        }

        if(key=="multipleChoices" || key=="time"|| key=="date"){
            for(key2 in formdata[key]){
                result.push({
                    "questionId":key2,
                    "chosenAnswers":[formdata[key][key2]]
                })
            }
        }
        if(key=="tags"){
            for(key2 in formdata[key]){
                var answers=[]
                for(i in formdata[key][key2]){
                    answers.push(formdata[key][key2][i].text)
                }

                result.push({
                    "questionId":key2,
                    "chosenAnswers":answers
                })
            }
        }
    }
    return result
}

function assessmentData(rating,questionList){
    answerData=[];
    for(key in rating){
        answerData.push({"questionId":questionList[key]._id,
                            "chosen":rating[key]
                        });
    }
    return answerData;
}

function timeConvert(inputdate){
    var datecurrent=new Date($.now());
    var date= new Date(inputdate);
    var seconds= (datecurrent-date)/1000;
    var outtime=''
    if(seconds<60)
        outtime='vài giây trước';
    else if(seconds<3600)
        outtime= Math.round(seconds/60) + ' phút trước';
    else if(seconds<86400)
        outtime= Math.round(seconds/3600)+ ' giờ trước';
    else if(seconds<86400*6)
        outtime=Math.round(seconds/86400)+' ngày trước';
    else
        outtime=date.toISOString().slice(0,10);
    return outtime;
}

function studentGroupConvert(groupArray){
    groups=[];
    for(var i in groupArray){
        groups.push({"value":groupArray[i]._id,
                    "label":groupArray[i].name
                    });
    }
    return groups;
}

$(function () {
    if (!localStorage.getItem('ngStorage-accessToken')) {
        boltLoadingGlobal();
    }
})
/*Duyen Ha*/
function getCourseQuestionListData(listData,newSection,newSectionQuestions){
    listData.push({
        "sectionDetail":newSection,
        "questionList":newSectionQuestions
    })
}

function convertSectionNameIdArray(sections) {
    var result = []
    console.log(sections);
    console.log(sections.length);
    for (i = 0; i < sections.length; i++) {
        result.push({'value': sections[i]._id, 'label': sections[i].name});
    }
    console.log(result);
    return result;
}
/*END---Duyen Ha*/

function getStudyQualitySuggestion(records,semesterRecords,credits){

    var totalCredits = 0.0;
    var totalScore4 = 0.0;
    var credit = 0;
    var score = 0.0;
    var failCount =0;
    var totalFailCredit=0;
    for (i = 0; i < records.length; i++) {
        var score = studentRecord4(records[i].attempt[ records[i].attempt.length-1].score);
        var subjectCode = records[i].subjectCode;
        if (subjectCode in credits && score !== 0) {                       //if subjectCode exist
            credit = credits[records[i].subjectCode];
            totalCredits += credit;
            totalScore4 += score * credit;
        }
        else if(score == 0){
            failCount +=1;
            totalFailCredit += credits[records[i].subjectCode];
        }
    }
    var result = totalScore4 / totalCredits;
    var CGPA = Number(Math.round(result + 'e2') + 'e-2');
    suggestionList = [];
    var graduationConditionList =[];
    if(CGPA < 2.5 && CGPA > 2.35){suggestionList.push('Bạn đã gần tiêu chuẩn có thể tốt nghiệp loại khá, hãy cố gắng hơn vào kỳ tới và duy trì');}
    else if(CGPA < 3.2&&  CGPA > 3.05){suggestionList.push('Bạn đã gần tiêu chuẩn có thể tốt nghiệp loại giỏi, hãy cố gắng hơn vào kỳ tới và duy trì');}
    else if(CGPA < 3.6&& CGPA > 3.45){suggestionList.push('Bạn đã gần tiêu chuẩn có thể tốt nghiệp loại xuất sắc, hãy cố gắng hơn vào kỳ tới và duy trì');}
    if(failCount/records.length >= 0.1){
        suggestionList.push('Bạn đang nợ quá nhiều môn hãy cố gắng học lại sớm');
        graduationConditionList.push('Bạn đang nợ quá nhiều môn hãy cố gắng cải thiện để có đủ điều kiện tốt nghiệp')
    }
    if(totalFailCredit>=24){
        suggestionList.push('Bạn đang nợ quá nhiều môn hãy cố gắng học lại sớm để không bị cảnh báo học vụ');
    }
    if(CGPA <=1.8){
        suggestionList.push('Điểm trung bình tích lũy hiện tại của bạn đang quá thấp, hãy chú ý và cố gắng');
        graduationConditionList.push('Điểm trung bình tích lũy hiện tại của bạn đang quá thấp, hãy cố gắng để đủ điều kiện tốt nghiệp');
    }
    //if the duc///
    //if mon tu chon//
    return [suggestionList, graduationConditionList];
}

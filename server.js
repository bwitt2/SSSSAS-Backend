var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var logger = require('./logger');

mongoose.connect('mongodb://localhost:27017');

var app = express();

app.use(function (request, response, next) {
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.header('Access-Control-Allow-Methods', 'POST, PATCH, GET, PUT, DELETE, OPTIONS');
    next();
});

app.use(logger);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//app.use(express.static('public'));



var studentsSchema = mongoose.Schema(
    {
        number: String,
        firstName: String,
        lastName: String,
        DOB: Date,
        residency: {type: mongoose.Schema.ObjectId, ref: 'ResidencyModel'},
        gender: {type: mongoose.Schema.ObjectId, ref: 'GenderModel'},
        academicLoad: {type: mongoose.Schema.ObjectId, ref: 'AcademicLoadModel'}
    }
);

var residencySchema = mongoose.Schema(
    {
        name: String,
        students: [{type: mongoose.Schema.ObjectId, ref: ('StudentsModel')}]
    }
);

var genderSchema = mongoose.Schema(
    {
        name: String,
        students: [{type: mongoose.Schema.ObjectId, ref: ('StudentsModel')}]
    }
); 

var academicLoadSchema = mongoose.Schema(
    {
        name: String,
        students: [{type: mongoose.Schema.ObjectId, ref: ('StudentsModel')}]
    }
);

var StudentsModel = mongoose.model('student', studentsSchema);
var ResidencyModel = mongoose.model('residency', residencySchema);
var GenderModel = mongoose.model('gender', genderSchema);
var AcademicLoadModel = mongoose.model('academicLoad', academicLoadSchema);


app.route('/students')
    .post(function (request, response) {
        var student = new StudentsModel(request.body.student);
        student.save(function (error) {
            if (error) response.send(error);
            response.json({student: student});
        });
    })
    .get(function (request, response) {
        var Student = request.query.student;
        if (!Student) {
            StudentsModel.find(function (error, students) {
                if (error) response.send(error);
                response.json({student: students});
            });
        } else {
            //        if (Student == "residency")
            StudentsModel.find({"residency": request.query.residency}, function (error, students) {
                if (error) response.send(error);
                response.json({student: students});
            });
        }
    });

app.route('/students/:student_id')
    .get(function (request, response) {
        StudentsModel.findById(request.params.student_id, function (error, student) {
            if (error) {
                response.send({error: error});
            }
            else {
                response.json({student: student});
            }
        });
    })
    .put(function (request, response) {
        StudentsModel.findById(request.params.student_id, function (error, student) {
            if (error) {
                response.send({error: error});
            }
            else {
                student.number = request.body.student.number;
                student.firstName = request.body.student.firstName;
                student.lastName = request.body.student.lastName;
                student.DOB = request.body.student.DOB;
                student.resInfo = request.body.student.resInfo;

                student.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({student: student});
                    }
                });
            }
        });
    })
    .delete(function (request, response) {
        StudentsModel.findByIdAndRemove(request.params.student_id,
            function (error, deleted) {
                if (!error) {
                    response.json({student: deleted});
                };
            }
        );
    });

app.route('/residencies')
    .post(function (request, response) {
        var residency = new ResidencyModel(request.body.residency);
        residency.save(function (error) {
            if (error) response.send(error);
            response.json({residency: residency});
        });
    })
    .get(function (request, response) {
        var Student = request.query.filter;
        if (!Student) {
            ResidencyModel.find(function (error, residencies) {
                if (error) response.send(error);
                response.json({residency: residencies});
            });
        } else {
            PermissionTypeModel.find({"student": Student.student}, function (error, students) {
                if (error) response.send(error);
                response.json({residency: students});
            });
        }
    });

app.route('/residencies/:residency_id')
    .get(function (request, response) {
        ResidencyModel.findById(request.params.residency_id, function (error, residency) {
            if (error) response.send(error);
            response.json({residency: residency});
        })
    })
    .put(function (request, response) {
        ResidencyModel.findById(request.params.residency_id, function (error, residency) {
            if (error) {
                response.send({error: error});
            }
            else {
                residency.name = request.body.residency.name;
                residency.students = request.body.residency.students;

                residency.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({residency: residency});
                    }
                });
            }
        })
    });

app.route('/genders')
    .post(function (request, response) {
        var gender = new GenderModel(request.body.gender);
        gender.save(function (error) {
            if (error) response.send(error);
            response.json({gender: gender});
        });
    })
    .get(function (request, response) {
        var Student = request.query.filter;
        if (!Student) {
            GenderModel.find(function (error, genders) {
                if (error) response.send(error);
                response.json({gender: genders});
            });
        } else {
            PermissionTypeModel.find({"student": Student.student}, function (error, students) {
                if (error) response.send(error);
                response.json({gender: students});
            });
        }
    });

app.route('/academicloads')
    .post(function (request, response) {
        var academicLoad = new AcademicLoadModel(request.body.academicLoad);
        academicLoad.save(function (error) {
            if (error) response.send(error);
            response.json({academicLoad: academicLoad});
        });
    })
    .get(function (request, response) {
        var Student = request.query.filter;
        if (!Student) {
            AcademicLoadModel.find(function (error, academicLoads) {
                if (error) response.send(error);
                response.json({academicLoad: academicLoads});
            });
        } else {
            PermissionTypeModel.find({"student": Student.student}, function (error, students) {
                if (error) response.send(error);
                response.json({academicLoad: students});
            });
        }
    });




app.listen(7700, function () {
    console.log('Listening on port 7700');
});


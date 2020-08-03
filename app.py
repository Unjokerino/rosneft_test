#!flask/bin/python
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from marshmallow_sqlalchemy import ModelSchema
from decimal import Decimal
import inspect

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://uygwncqh:fWTy5sZl8vZOQzmFiR2WAMWgA0ghuP9O@ruby.db.elephantsql.com:5432/uygwncqh'

db = SQLAlchemy(app)
ma = Marshmallow(app)

class courses(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50))
    image_url = db.Column(db.String(50))
    def __repr__(self):
        return '<Course %r>' % self.title

class course_files(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.String(250), db.ForeignKey('courses.id'))
    filename = db.Column(db.String)
    length = db.Column(db.Integer)
    def __repr__(self):
        return '<length %r>' % self.length

class course_ratings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.String(250), db.ForeignKey('courses.id'))
    mark = db.Column(db.Integer)
    user_id = db.Column(db.Integer)
    def sum_mark(self):
        return len(db.session.query(courses).filter(courses.course_id == self.id).all())
    def avg_mark(self):
        return len(db.session.query(courses).filter(courses.course_id == self.id).all())
    def __repr__(self):
        return '<mark %r>' % self.mark

class CoursesSchema(ma.SQLAlchemySchema):
    class Meta:
        model = courses 

tasks = []
courses_query = db.session.query(courses).all()


for course in courses_query:
    ratings_data = db.session.query(db.func.avg(course_ratings.mark).label('average'),db.func.count(course_ratings.mark).label('sum')).filter(course_ratings.course_id == course.id).all()
    files_data = db.session.query(db.func.sum(course_files.length).label('length')).filter(course_files.course_id == course.id).all()
    for files in files_data:
        files_length = int(files[0])
        print(files_length)
    for rating in ratings_data:
        rating_avg = float(rating[0])
        rating_count = rating[1]

    tasks.append({
        "id": course.id,
        "rating_count": rating_count,
        "rating": rating_avg,
        "title": course.title,
        "time_count": files_length,
        "image_url": course.image_url
    })
    pass

@app.route('/')
def index():
    return "Hello"


@app.route('/api/get_courses', methods=['GET'])
def get_tasks():
    return jsonify(tasks)
    


if __name__ == '__main__':
    app.run(debug=True)

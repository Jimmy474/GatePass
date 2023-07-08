import json
import os
import uuid
from flask import Flask, render_template, request
from datetime import datetime

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')


@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['image']
    if file:
        # Save the uploaded file
        file.save('static/Image/image.jpg')
        return 'Image uploaded successfully!'
    else:
        return 'No file selected.'


@app.route('/Pass', methods=['POST'])
def GeneratePass():

    image_file = request.files['image']
    filename = 'image.jpg'
    filepath = os.path.join('static', 'Image', filename)

    image_url = '/' + filepath

    visitor_name = request.form.get('visitor_name')
    coming_from = request.form.get('coming_from')
    adhar_number = request.form.get('adhar_number')
    mobile_number = request.form.get('mobile_number')
    token_number = request.form.get('token_number')
    helmet_number = request.form.get('helmet_number')
    requested_person = request.form.get('requested_person')
    purpose = request.form.get('purpose')
    time_in = datetime.now().strftime("%H:%M")
    current_date = datetime.now().strftime("%d/%m/%Y")

    pass_number = request.form.get('pass_number')

    return render_template('pass.html', image_url=image_url, 
                           visitor_name=visitor_name, 
                           coming_from=coming_from,
                           adhar_number=adhar_number, 
                           mobile_number=mobile_number,
                           token_number=token_number,
                           helmet_number=helmet_number,
                           requested_person=requested_person, 
                           purpose=purpose,
                           time_in=time_in,
                           current_date=current_date,
                           pass_number=pass_number)


if __name__ == '__main__':
    app.run()


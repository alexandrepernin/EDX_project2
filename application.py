import os

from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channels = []

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/channel", methods=["GET", "POST"])
def channel():
    if request.method == 'POST':
        name = request.form.get("name")
        return render_template('channel.html', name=name, channels=channels)
    elif request.method == 'GET':
            return render_template('channel.html' , channels=channels)

@app.route("/chat", methods=["GET","POST"])
def chat():
    channel = request.form.get("channel_name")
    channels.append(channel)
    #     return("New channel named {}".format(channel))
    return render_template('chat.html')

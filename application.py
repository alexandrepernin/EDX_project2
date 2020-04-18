import os

from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channels = []
votes = {"yes": 0, "no": 0, "maybe": 0}

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
    #channel = request.form.get("channel_name")
    #channels.append(channel)
    #     return("New channel named {}".format(channel))
    return render_template('chat.html')

@socketio.on("submit vote")
def vote(data):
    selection = data["selection"]
    emit("announce vote", {"selection": selection}, broadcast=True)

@app.route("/create-channel", methods=["POST"])
def create_channel():
    global channels
    channel = request.form.get("channel_name")
    if channel is None:
        return jsonify({"success": False})
    else:
        channels.append(channel)
        channels = list(dict.fromkeys(channels))
        return jsonify({"success": True})

if __name__ == '__main__':
    socketio.run(app)

from flask import Flask
app = Flask(__name__)

@app.route("/")
def index():
	return "Index!"

@app.route("/hello")
def hello():
	return "Hello World!"

@app.route("/members")
def memebers():
	return "Members"

@app.route("/members/<string:name>/")
def getMember(name):
	return name

if __name__ == "__main__":
	app.run()

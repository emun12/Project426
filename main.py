from flask import Flask,render_template
from flask_restful import Api, Resource

app = Flask(__name__)
api = Api(app)

class HelloWorld(Resource):
   def get(self):
      return {"data":"Hello World"}

api.add_resource(HelloWorld,"/helloworld")

if __name__ == '__main__':
   app.run(debug=True)
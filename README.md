# 😀🤨 MoodMirror 🤨😀

MoodMirror App is an innovative and intuitive application designed to detect and respond to the emotions of a person sitting in front of a computer. Using advanced facial analysis, the app identifies emotional states such as happiness, sadness or anger, and reacts accordingly to enhance the user’s well-being and productivity. Whether it’s playing relaxing music, suggesting a break, offering motivational content, or triggering an energizing sound, MoodMirror adapts in real time to support the user’s mood. With a sleek interface and smart features, the app creates a personalized and emotionally aware digital environment, making every interaction more thoughtful, responsive, and human-centered. 

<img width="1436" src="https://github.com/user-attachments/assets/4c611ede-488b-4570-b307-58784d05639b" />
<img width="1436" src="https://github.com/user-attachments/assets/4cd86b01-5b19-4701-888a-b74991d3432d" />


# 💻 Technologies Used   

MoodMirror App is built using the following technologies:  

📍 React – for building a responsive and interactive frontend interface that seamlessly displays real-time emotion recognition feedback    
📍 Flask – as the backend framework powering emotion analysis logic and coordinating between the frontend and the machine learning model    
📍 Custom-Trained TensorFlow Model –  trained on the [Face Expression Recognition Dataset](https://www.kaggle.com/datasets/jonathanoheix/face-expression-recognition-dataset) from Kaggle to accurately classify user emotions based on webcam input. The **training_code** file contains the code used for training the model.    
📍 NumPy, Matplotlib, Seaborn, scikit-learn, TensorFlow – used for data preprocessing, visualization, model development, training, and evaluation during the machine learning pipeline    
📍 OpenCV – for capturing and processing real-time webcam video feed for face detection and input to the model    


# 🏁 Getting Started  

To get started with the MoodMirror App, follow these steps:  

1️⃣ Clone the Repository      

Download the repository to your local machine by running the following command in your terminal:    
```bash
git clone https://github.com/hsialitskaya/MoodMirror_App.git MoodMirror
```  

2️⃣ Install Frontend Dependencies

Make sure you have Node.js installed. Then navigate to the frontend directory and install dependencies:
```bash
cd MoodMirror/frontend
npm install
```

3️⃣ Run the Application

Once the dependencies are installed, start the development server by running:
```bash
npm start
```

This will launch the app locally, and you can view it in your browser at **http://localhost:3002**.

4️⃣ Set Up the Backend

Make sure you have Python (preferably 3.8+) and pip installed. Navigate to the backend directory and create a virtual environment:  
```bash
cd MoodMirror/backend
pip3 install -r requirements.txt
```

5️⃣ Run the Backend Server
Once dependencies are installed, start the Flask backend:
```bash
python app.py
```

## License  
MoodMirror is licensed under the MIT License. See [LICENSE](https://github.com/hsialitskaya/MoodMirror_App/blob/main/LICENSE) for more information.      


Enjoy exploring your emotions and let MoodMirror help you stay mindful, focused, and refreshed throughout your day! 🎉  


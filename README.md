# DGT Exam Practice Platform

A comprehensive web-based platform for practicing Spanish DGT (Dirección General de Tráfico) driving license exams with trilingual support.

## Features

- **30-Question Random Exams**: Each exam contains 30 randomly selected questions from a pool of 2,000+ questions
- **Trilingual Support**: Choose between English, Spanish (Español), or Russian (Русский)
- **Pass/Fail Logic**: Pass with 3 or fewer incorrect answers, fail with 4 or more
- **Progress Tracking**: Track your exam history and statistics
- **Detailed Explanations**: Review answers after completing the exam with full explanations and images
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Local Statistics**: View your total exams taken, passed, and failed

## How to Use

### 1. **Access the Platform**
   - Open `index.html` in a modern web browser
   - Or serve the folder using a local web server (recommended for better performance)

### 2. **Select Language**
   - Click on one of the three language buttons (English, Español, or Русский)
   - The "Start Practice Exam" button will become enabled
   - Click "Start Practice Exam"

### 3. **Complete the Exam**
   - Read each question carefully
   - Review the question image if available
   - Select one of the three answer options
   - Click "Next" to proceed to the next question
   - Use "Previous" to review earlier questions
   - On the last question, "Next" becomes "Submit Exam"

### 4. **View Results**
   - After submitting, you'll see your score and pass/fail status
   - View your statistics (correct answers, incorrect answers, percentage)
   - Click "Review Answers" to see explanations for all questions
   - Click "Start New Exam" to take another exam

### 5. **Review Mode**
   - Review your answers with detailed explanations
   - See which answers were correct/incorrect
   - Read the official driving rules and regulations
   - View images associated with questions

## Project Structure

```
exams-dgt/
├── index.html           # Main HTML file
├── styles.css          # All styling and responsive design
├── script.js           # Core application logic
├── pdd-v2.json         # Question database (2,000+ questions)
├── pdd.json            # Alternative question source
├── images/             # Question images (3,800+ images)
└── README.md           # This file
```

## Technical Details

### Data Structure
Each question in the JSON has the following structure:
```json
{
  "Id": 1,
  "Q": {
    "R": "Russian question",
    "S": "Spanish question",
    "E": "English question"
  },
  "QImg": "Y|N",
  "Rule": {
    "R": "Russian explanation",
    "S": "Spanish explanation",
    "E": "English explanation"
  },
  "A": [
    {
      "Y": true/false,
      "T": {
        "R": "Russian answer",
        "S": "Spanish answer",
        "E": "English answer"
      }
    },
    // ... 2 more answers
  ],
  "Terms": [...],
  "Img": true/false,
  "TopicId": 15
}
```

### Local Storage
The platform uses browser localStorage to save:
- Exam history with results and timestamps
- Statistics about passed/failed exams

## Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Mobile Browsers**: Full support with responsive design

## Features Explained

### Exam Randomization
- Each exam selects 30 random questions from the complete pool
- Questions are shuffled using a simple randomization algorithm
- Multiple exams will have different questions

### Scoring System
- **Correct answers**: Increase your score
- **Incorrect answers**: Count towards the fail threshold
- **Pass threshold**: 3 or fewer incorrect answers = PASS
- **Fail threshold**: 4 or more incorrect answers = FAIL
- **Score calculation**: (Correct / 30) × 100

### Language Support
The platform supports three languages for each question:
- **English (E)**: English versions of all questions and answers
- **Spanish (S)**: Spanish versions (Español)
- **Russian (R)**: Russian versions (Русский)

### Statistics
View your performance metrics:
- **Total Exams**: Count of all exams taken
- **Passed**: Number of exams you passed
- **Failed**: Number of exams you failed

## Tips for Success

1. **Read Carefully**: Take time to understand each question
2. **Review Images**: Pay attention to road signs and traffic scenarios shown in images
3. **Learn from Mistakes**: Use the review section to understand why you got answers wrong
4. **Consistent Practice**: Take multiple exams to improve your knowledge
5. **Focus on Weak Areas**: Review the explanations for topics you struggle with

## Common Issues & Solutions

### Images Not Loading
- Ensure the `images/` folder is in the same directory as `index.html`
- Check that image files are named with their question IDs (e.g., `1.jpg`, `2.jpg`)

### JavaScript Not Working
- Make sure JavaScript is enabled in your browser
- Use a modern browser (Chrome, Firefox, Safari, Edge)
- For development, avoid using `file://` protocol; use a local web server

### Data Not Loading
- Verify that `pdd-v2.json` is in the same directory as `index.html`
- Check browser console for any errors (F12 → Console tab)
- Ensure the JSON file is not corrupted

## Local Web Server Setup (Optional but Recommended)

### Using Python 3:
```bash
python -m http.server 8000
```
Then visit: `http://localhost:8000`

### Using Node.js (http-server):
```bash
npx http-server
```

### Using PHP:
```bash
php -S localhost:8000
```

## Future Enhancements

Potential features for future versions:
- User authentication and cloud sync
- Topic-specific practice exams
- Timed exams with countdown timer
- Detailed analytics by topic
- Dark mode support
- Offline support with service workers
- Export exam results as PDF

## License

This platform is created for educational purposes to help prepare for DGT driving license exams.

## Support

For issues or questions:
1. Check the browser console for error messages (F12)
2. Verify all files are in the correct location
3. Clear browser cache and reload
4. Try a different browser

---

**Happy studying! Good luck with your DGT exam! 🚗📖**

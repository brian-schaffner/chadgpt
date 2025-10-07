# 🎤 Custom Pete Davidson Voice Training Guide

## **Overview**
This guide will help you train a custom TTS model using Pete Davidson's voice from your source videos.

## **🎯 What You'll Get**
- **Custom Pete Davidson voice model** trained on your specific audio
- **High-quality TTS** that sounds like Pete Davidson
- **Mood-based variations** (neutral, excited, apathetic, grin, smirk)
- **Local processing** - no API costs or internet required

## **📋 Prerequisites**
- Python 3.8+ installed
- At least 8GB RAM (16GB recommended)
- GPU recommended for faster training
- Pete Davidson audio files in `videos/` directory

## **🚀 Quick Start**

### **Step 1: Run the Training Pipeline**
```bash
# Make sure you're in the chadgpt directory
cd /Users/brian/dev/chadgpt/chadgpt

# Run the complete training pipeline
./scripts/train-pete-voice.sh
```

### **Step 2: Wait for Training**
- **Voice extraction**: 5-10 minutes
- **Model training**: 30-60 minutes (depending on hardware)
- **Total time**: 1-2 hours

### **Step 3: Test the Model**
The trained model will automatically be used by ChadGPT when available.

## **🔧 Manual Steps (if needed)**

### **1. Extract Voice Audio**
```bash
# Install dependencies
pip install demucs librosa soundfile

# Extract voice from videos
python scripts/extract-voice.py
```

### **2. Set up Training Environment**
```bash
# Create virtual environment
python3 -m venv tts_env
source tts_env/bin/activate

# Install TTS libraries
pip install TTS demucs librosa soundfile torch
```

### **3. Train the Model**
```bash
# Train custom voice model
python scripts/train-pete-voice.py
```

## **📁 File Structure**
```
chadgpt/
├── videos/                          # Your Pete Davidson audio files
├── training_data/
│   ├── cleaned_voice/               # Extracted voice audio
│   └── pete_davidson/               # Training data
├── models/
│   └── pete_davidson_voice/          # Trained model
└── scripts/
    ├── extract-voice.py             # Voice extraction
    ├── train-pete-voice.py          # Model training
    └── train-pete-voice.sh          # Complete pipeline
```

## **🎛️ Customization Options**

### **Training Parameters**
Edit `scripts/train-pete-voice.py` to adjust:
- **Number of epochs**: `num_epochs=100`
- **Batch size**: `batch_size=4`
- **Learning rate**: `learning_rate=0.0001`

### **Voice Quality**
Edit `scripts/extract-voice.py` to adjust:
- **Sample rate**: `sr=22050`
- **Audio cleaning**: `top_db=20`
- **Normalization**: `librosa.util.normalize`

## **🔍 Troubleshooting**

### **Common Issues**

1. **"No videos found"**
   - Make sure audio files are in `videos/` directory
   - Supported formats: `.m4a`, `.mp3`, `.wav`

2. **"Demucs failed"**
   - Install Demucs: `pip install demucs`
   - Check audio file format

3. **"Training failed"**
   - Check available RAM (need 8GB+)
   - Try reducing batch size
   - Use GPU if available

4. **"Model not loading"**
   - Check if model files exist in `models/pete_davidson_voice/`
   - Verify training completed successfully

### **Performance Tips**

1. **Use GPU** for faster training:
   ```bash
   pip install torch torchaudio --index-url https://download.pytorch.org/whl/cu118
   ```

2. **Increase RAM** if training fails:
   - Close other applications
   - Use smaller batch size

3. **Quality vs Speed**:
   - More epochs = better quality, longer training
   - Larger batch size = faster training, more RAM

## **📊 Expected Results**

### **Training Progress**
- **Epoch 1-10**: Basic voice recognition
- **Epoch 11-50**: Voice characteristics emerge
- **Epoch 51-100**: Fine-tuning and optimization

### **Quality Metrics**
- **Good**: Clear voice, recognizable Pete Davidson characteristics
- **Excellent**: Natural intonation, mood variations work well
- **Perfect**: Indistinguishable from real Pete Davidson voice

## **🎉 Success!**

Once training completes:
1. **Model automatically loads** in ChadGPT
2. **TTS uses custom voice** for responses without WAV files
3. **Mood variations** work with custom voice
4. **No API costs** - everything runs locally

## **🔄 Retraining**

To improve the model:
1. **Add more audio files** to `videos/`
2. **Run training again**: `./scripts/train-pete-voice.sh`
3. **Model automatically updates** in ChadGPT

## **💡 Tips for Best Results**

1. **Use high-quality audio** (clear, no background noise)
2. **Include variety** (different emotions, speeds, contexts)
3. **At least 10 minutes** of total audio for good results
4. **Clean audio** works better than raw recordings

---

**🎤 Happy voice training! Your custom Pete Davidson voice will make ChadGPT sound amazing!**

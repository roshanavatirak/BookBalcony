const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    settingKey: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    settingValue: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    description: {
      type: String,
      trim: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    }
  },
  {
    timestamps: true
  }
);

// Static method to get a setting value
settingsSchema.statics.getSetting = async function(key, defaultValue = null) {
  try {
    const setting = await this.findOne({ settingKey: key });
    return setting ? setting.settingValue : defaultValue;
  } catch (error) {
    console.error("Error getting setting:", error);
    return defaultValue;
  }
};

// Static method to set a setting value
settingsSchema.statics.setSetting = async function(key, value, userId = null, description = null) {
  try {
    const updateData = {
      settingValue: value,
      updatedBy: userId
    };
    
    if (description) {
      updateData.description = description;
    }
    
    const setting = await this.findOneAndUpdate(
      { settingKey: key },
      updateData,
      { 
        new: true, 
        upsert: true,
        setDefaultsOnInsert: true
      }
    );
    
    return setting;
  } catch (error) {
    console.error("Error setting setting:", error);
    throw error;
  }
};

// Static method to initialize default settings
settingsSchema.statics.initializeDefaults = async function() {
  try {
    const defaults = [
      {
        settingKey: "autoStatusMode",
        settingValue: true,
        description: "Automatically change book status from 'Arriving Soon' to 'Available'"
      },
      {
        settingKey: "autoStatusDelayHours",
        settingValue: 0,
        description: "Hours to wait before auto-approving books (0 = immediate)"
      }
    ];
    
    for (const def of defaults) {
      await this.findOneAndUpdate(
        { settingKey: def.settingKey },
        def,
        { upsert: true, setDefaultsOnInsert: true }
      );
    }
    
    console.log("Default settings initialized");
  } catch (error) {
    console.error("Error initializing default settings:", error);
  }
};

module.exports = mongoose.models.Settings || mongoose.model("Settings", settingsSchema);
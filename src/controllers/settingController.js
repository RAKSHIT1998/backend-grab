import Setting from '../models/settingModel.js';

export const getSettings = async (req, res) => {
  try {
    const settings = await Setting.find({});
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

export const updateSetting = async (req, res) => {
  try {
    const { key, value, description } = req.body;
    if (!key) return res.status(400).json({ error: 'Key is required' });

    let setting = await Setting.findOne({ key });
    if (setting) {
      setting.value = value;
      if (description !== undefined) setting.description = description;
    } else {
      setting = new Setting({ key, value, description });
    }
    await setting.save();
    res.json(setting);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update setting' });
  }
};

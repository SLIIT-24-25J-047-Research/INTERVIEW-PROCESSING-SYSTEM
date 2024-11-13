const SkillGroup = require('../../models/employer/SkillGroup');
const Question = require('../../models/employer/Question');


const getLastGroupIdInRange = async (focus) => {
    let prefix, minRange, maxRange;
  
    if (focus === 'frontend') {
      prefix = 'frontend-';
      minRange = 1;
      maxRange = 10;
    } else if (focus === 'backend') {
      prefix = 'backend-';
      minRange = 11;
      maxRange = 20;
    } else if (focus === 'fullstack') {
      prefix = 'fullstack-';
      minRange = 21;
      maxRange = 30;
    }
  
    const skillGroup = await SkillGroup.findOne({ groupId: { $regex: `^${prefix}` } })
      .sort({ groupId: -1 })
      .exec();
  
    const lastId = skillGroup
      ? parseInt(skillGroup.groupId.split('-')[1], 10)
      : minRange - 1;
  
    const nextId = lastId + 1;
  
    if (nextId > maxRange) {
      throw new Error(`Group ID limit reached for ${focus}`);
    }
  
    return `${prefix}${nextId}`;
  };


exports.createSkillGroup = async (req, res) => {
  try {
    const { name, skills, focus } = req.body;
    const groupId = await getLastGroupIdInRange(focus);

    const skillGroup = new SkillGroup({ name, skills, focus, groupId });
    await skillGroup.save();
    res.status(201).json(skillGroup);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllSkillGroups = async (req, res) => {
  try {
   
      const skillGroups = await SkillGroup.find();
      if (skillGroups.length === 0) {
          return res.status(404).json({ message: 'No skill groups found.' });
      }

      // count the number of related questions
      const skillGroupsWithQuestionCount = await Promise.all(skillGroups.map(async (group) => {
          const questionCount = await Question.countDocuments({ skillGroupId: group._id });
          return { ...group.toObject(), questionCount };
      }));

      res.status(200).json(skillGroupsWithQuestionCount);
  } catch (error) {
      console.error('Error fetching skill groups:', error);
      res.status(500).json({ message: 'Error fetching skill groups', error });
  }
};



exports.getSkillGroupById = async (req, res) => {
  try {
    const skillGroup = await SkillGroup.findById(req.params.id);
    if (!skillGroup) {
      return res.status(404).json({ error: 'Skill Group not found' });
    }
    res.status(200).json(skillGroup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSkillGroup = async (req, res) => {
    try {
      const { name, skills, focus } = req.body;
      let updatedFields = { name, skills };
  
      
      const skillGroup = await SkillGroup.findById(req.params.id);
      if (!skillGroup) {
        return res.status(404).json({ error: 'Skill Group not found' });
      }
  
      if (focus && focus !== skillGroup.focus) {
        const newGroupId = await getLastGroupIdInRange(focus);
        updatedFields = { ...updatedFields, focus, groupId: newGroupId };
      }
  
      const updatedSkillGroup = await SkillGroup.findByIdAndUpdate(
        req.params.id,
        updatedFields,
        { new: true }
      );
  
      res.status(200).json(updatedSkillGroup);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };



exports.getSkillGroupsByFocus = async (req, res) => {
    try {
      const { focus } = req.params;
      const skillGroups = await SkillGroup.find({ focus });
  
      if (!skillGroups.length) {
        return res.status(404).json({ error: `No skill groups found for focus area: ${focus}` });
      }
  
      res.status(200).json(skillGroups);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

exports.getSkillGroupsBySkill = async (req, res) => {
    try {
      const { skill } = req.params;
      const skillGroups = await SkillGroup.find({ skills: skill });
  
      if (!skillGroups.length) {
        return res.status(404).json({ error: `No skill groups found containing skill: ${skill}` });
      }
  
      res.status(200).json(skillGroups);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

exports.deleteSkillGroup = async (req, res) => {
  try {
    const skillGroup = await SkillGroup.findByIdAndDelete(req.params.id);
    if (!skillGroup) {
      return res.status(404).json({ error: 'Skill Group not found' });
    }
    res.status(200).json({ message: 'Skill Group deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

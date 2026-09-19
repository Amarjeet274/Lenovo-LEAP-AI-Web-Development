import DoubtConversation from "../models/DoubtConversation.js";
import { generateDoubtAnswer } from "../services/doubtService.js";
import { recordActivity } from "../services/activityService.js";

export const askDoubt = async (req, res) => {
  try {
    const { question, conversationId } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        message: "Question is required",
      });
    }

    let conversation;

    // Existing conversation
    if (conversationId) {
      conversation = await DoubtConversation.findOne({
        _id: conversationId,
        user: req.user._id,
      });

      if (!conversation) {
        return res.status(404).json({
          message: "Conversation not found",
        });
      }
    } else {
      // Create a new conversation
      conversation = await DoubtConversation.create({
        user: req.user._id,
        title: question.trim().slice(0, 80),
        messages: [],
      });
    }

    const previousMessages = conversation.messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    const answer = await generateDoubtAnswer({
      question: question.trim(),
      conversation: previousMessages,
    });

    conversation.messages.push({
      role: "user",
      content: question.trim(),
    });

    conversation.messages.push({
      role: "assistant",
      content: answer,
    });

    await conversation.save();

    await recordActivity({
      userId: req.user._id,
      type: "doubt_asked",
      title: "Asked SkillPath AI",
      description:
        "You asked the AI learning assistant a question.",
      metadata: {
        conversationId:
          conversation._id,
      },
    });

    return res.status(200).json({
      message: "Doubt answered successfully",
      conversation,
      answer,
    });
  } catch (error) {
    console.error("Doubt Assistant Error:", error);

    return res.status(500).json({
      message: "Failed to generate AI answer",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};
export const getMyConversations = async (req, res) => {
  try {
    const conversations = await DoubtConversation.find({
      user: req.user._id,
    })
      .sort({ updatedAt: -1 })
      .select("title messages createdAt updatedAt");

    return res.status(200).json({
      conversations,
    });
  } catch (error) {
    console.error("Conversation Fetch Error:", error);

    return res.status(500).json({
      message: "Failed to fetch conversations",
    });
  }
};

export const getConversation = async (req, res) => {
  try {
    const conversation = await DoubtConversation.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    return res.status(200).json({
      conversation,
    });
  } catch (error) {
    console.error("Conversation Fetch Error:", error);

    return res.status(500).json({
      message: "Failed to fetch conversation",
    });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const conversation = await DoubtConversation.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    return res.status(200).json({
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    console.error("Conversation Delete Error:", error);

    return res.status(500).json({
      message: "Failed to delete conversation",
    });
  }
};
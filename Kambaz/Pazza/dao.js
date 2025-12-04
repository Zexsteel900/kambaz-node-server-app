import { v4 as uuidv4 } from "uuid";
import { PostModel, FolderModel } from "./model.js";

export default function PazzaDao() {
  // -------------------------
  // POSTS
  // -------------------------
  const createPost = async (data) => {
    const newPost = {
      ...data,
      _id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      answersInstructors: [],
      answersStudents: [],
      followups: [],
    };
    return PostModel.create(newPost);
  };

  const findPostsByCourse = async (courseId) =>
    PostModel.find({ courseId }).sort({ createdAt: -1 });

  const findPostById = async (postId) => PostModel.findById(postId);

  const updatePost = async (postId, updates) =>
    PostModel.findByIdAndUpdate(postId, { ...updates, updatedAt: new Date() }, { new: true });

  const deletePost = async (postId) => PostModel.findByIdAndDelete(postId);

  // -------------------------
  // ANSWERS
  // -------------------------
  const addAnswer = async (postId, answer) => {
    const post = await PostModel.findById(postId);
    if (!post) return null;

    const answerItem = {
      ...answer,
      _id: uuidv4(),
      createdAt: new Date(),
    };

    if (answer.isInstructor)
      post.answersInstructors.push(answerItem);
    else
      post.answersStudents.push(answerItem);

    await post.save();
    return answerItem;
  };

  const updateAnswer = async (postId, answerId, updates) => {
    const post = await PostModel.findById(postId);
    if (!post) return null;

    let section = post.answersInstructors.find(a => a._id === answerId)
      ? "answersInstructors"
      : "answersStudents";

    let idx = post[section].findIndex(a => a._id === answerId);

    post[section][idx] = {
      ...post[section][idx],
      ...updates,
      updatedAt: new Date(),
    };

    await post.save();
    return post[section][idx];
  };

  const deleteAnswer = async (postId, answerId) => {
    const post = await PostModel.findById(postId);
    if (!post) return null;

    post.answersInstructors = post.answersInstructors.filter(a => a._id !== answerId);
    post.answersStudents = post.answersStudents.filter(a => a._id !== answerId);

    await post.save();
    return true;
  };

  // -------------------------
  // FOLLOWUPS & REPLIES
  // -------------------------
  const addFollowup = async (postId, followup) => {
    const post = await PostModel.findById(postId);
    if (!post) return null;

    const newFollowup = {
      ...followup,
      _id: uuidv4(),
      createdAt: new Date(),
      replies: [],
    };

    post.followups.push(newFollowup);
    await post.save();
    return newFollowup;
  };

  const addReply = async (postId, followupId, reply) => {
    const post = await PostModel.findById(postId);
    if (!post) return null;

    const followup = post.followups.find(f => f._id === followupId);
    if (!followup) return null;

    const newReply = {
      ...reply,
      _id: uuidv4(),
      createdAt: new Date(),
    };

    followup.replies.push(newReply);
    await post.save();
    return newReply;
  };

  const deleteFollowup = async (postId, followupId) => {
    const post = await PostModel.findById(postId);
    if (!post) return null;

    post.followups = post.followups.filter(f => f._id !== followupId);
    await post.save();
    return true;
  };

  const deleteReply = async (postId, followupId, replyId) => {
    const post = await PostModel.findById(postId);
    if (!post) return null;

    const f = post.followups.find(f => f._id === followupId);
    f.replies = f.replies.filter(r => r._id !== replyId);

    await post.save();
    return true;
  };

  // -------------------------
  // FOLDERS
  // -------------------------
  const getFolders = (courseId) => FolderModel.find({ courseId });

  const createFolder = async (courseId, name) =>
    FolderModel.create({
      _id: uuidv4(),
      courseId,
      name,
      createdAt: new Date(),
    });

  const deleteFolder = async (folderId) =>
    FolderModel.findByIdAndDelete(folderId);

  // -------------------------
  // STATS
  // -------------------------
  const getStats = async (courseId) => {
    const posts = await PostModel.find({ courseId });

    const total = posts.length;
    const unanswered = posts.filter(p =>
      p.answersInstructors.length === 0 &&
      p.answersStudents.length === 0
    ).length;

    return { total, unanswered };
  };

  return {
    createPost,
    findPostsByCourse,
    findPostById,
    updatePost,
    deletePost,

    addAnswer,
    updateAnswer,
    deleteAnswer,

    addFollowup,
    addReply,
    deleteFollowup,
    deleteReply,

    getFolders,
    createFolder,
    deleteFolder,

    getStats,
  };
}

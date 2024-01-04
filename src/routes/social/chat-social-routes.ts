import express from "express"

import extractFriendFromChat from "../../middleware/social/chat/extract-friend-from-chat"
import validateFriendId from "../../middleware/request-validation/social/validate-friend-id"
import confirmUsersAreFriends from "../../middleware/social/friend/confirm-users-are-friends"
import validateDirectMessage from "../../middleware/request-validation/social/chat/validate-direct-message"
import confirmUserIsDirectMessageChatParticipant from "../../middleware/social/chat/confirm-user-is-direct-message-chat-participant"
import confirmUserHasntBlockedFriend from "../../middleware/social/friend/confirm-user-hasnt-blocked-friend"
import validateDirectMessageId from "../../middleware/request-validation/social/chat/validate-direct-message-id"
import confirmMessageSentByOtherUser from "../../middleware/social/chat/confirm-message-sent-by-other-user"
import confirmFriendHasntBlockedUser from "../../middleware/social/friend/confirm-friend-hasnt-blocked-user"
import confirmDirectMessageChatDoesntExist from "../../middleware/social/chat/confirm-direct-message-chat-doesnt-exist"

import sendDirectMessage from "../../controllers/social/chat/send-direct-message"
import createDirectMessageChat from "../../controllers/social/chat/create-direct-mesage-chat"
import retrieveDirectMessageChats from "../../controllers/social/chat/retrieve-direct-message-chats"
import markDirectMessageAsRead from "../../controllers/social/chat/mark-direct-message-as-read"
import confirmMessageNotAlreadyMarkedRead from "../../middleware/social/chat/confirm-message-not-already-marked-read"
import confirmMessageSentByUser from "../../middleware/social/chat/confirm-message-sent-by-user"
import validateUpdatedMessageText from "../../middleware/request-validation/social/chat/validate-updated-message-text"
import updateDirectMessage from "../../controllers/social/chat/update-direct-message"
import editDirectMessageChatName from "../../controllers/social/chat/edit-direct-message-chat-name"
import validateDirectMessageChatId from "../../middleware/request-validation/social/chat/validate-direct-message-chat-id"
import retrieveDirectMessagesFromChat from "../../controllers/social/chat/retrieve-direct-messages-from-chat"
import validateNewDirectMessageName from "../../middleware/request-validation/social/chat/validate-new-direct-message-name"
import replyToDirectMessage from "../../controllers/social/chat/reply-to-direct-message"

const chatSocialRoutes = express.Router()

chatSocialRoutes.post(
	"/create-direct-message-chat",
	validateFriendId,
	confirmUserHasntBlockedFriend,
	confirmFriendHasntBlockedUser,
	confirmUsersAreFriends,
	confirmDirectMessageChatDoesntExist,
	createDirectMessageChat
)

chatSocialRoutes.post(
	"/send-direct-message",
	validateDirectMessageChatId,
	validateDirectMessage,
	extractFriendFromChat,
	confirmUserIsDirectMessageChatParticipant,
	confirmUserHasntBlockedFriend,
	confirmFriendHasntBlockedUser,
	confirmUsersAreFriends,
	sendDirectMessage
)

chatSocialRoutes.get("/retrieve-direct-message-chats", retrieveDirectMessageChats)

chatSocialRoutes.post(
	"/mark-direct-message-as-read",
	validateDirectMessageId,
	confirmUserIsDirectMessageChatParticipant,
	confirmMessageSentByOtherUser,
	confirmMessageNotAlreadyMarkedRead,
	markDirectMessageAsRead
)

chatSocialRoutes.post(
	"/update-direct-message",
	validateDirectMessageId,
	validateUpdatedMessageText,
	confirmMessageSentByUser,
	updateDirectMessage
)

chatSocialRoutes.post(
	"/edit-direct-message-chat-name",
	validateDirectMessageChatId,
	validateNewDirectMessageName,
	confirmUserIsDirectMessageChatParticipant,
	editDirectMessageChatName
)

chatSocialRoutes.get(
	"/retrieve-direct-messages-from-chat",
	validateDirectMessageChatId,
	confirmUserIsDirectMessageChatParticipant,
	retrieveDirectMessagesFromChat
)

chatSocialRoutes.post(
	"/reply-to-direct-message",
	validateDirectMessageChatId,
	validateDirectMessageId,
	validateDirectMessage,
	extractFriendFromChat,
	confirmUserIsDirectMessageChatParticipant,
	confirmUserHasntBlockedFriend,
	confirmFriendHasntBlockedUser,
	confirmUsersAreFriends,
	replyToDirectMessage
)

export default chatSocialRoutes

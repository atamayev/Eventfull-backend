import express from "express"

import extractFriendFromChat from "../../../middleware/social/chat/direct/extract-friend-from-chat"
import validateFriendId from "../../../middleware/request-validation/social/validate-friend-id"
import confirmUsersAreFriends from "../../../middleware/social/friend/confirm-users-are-friends"
import confirmMessageSentByUser from "../../../middleware/social/chat/direct/confirm-message-sent-by-user"
import validateDirectMessage from "../../../middleware/request-validation/social/chat/direct/validate-direct-message"
import confirmMessageSentByOtherUser from "../../../middleware/social/chat/direct/confirm-message-sent-by-other-user"
import confirmFriendHasntBlockedUser from "../../../middleware/social/friend/confirm-friend-hasnt-blocked-user"
import confirmUserHasntBlockedFriend from "../../../middleware/social/friend/confirm-user-hasnt-blocked-friend"
import validateDirectMessageId from "../../../middleware/request-validation/social/chat/direct/validate-direct-message-id"
import confirmMessageNotAlreadyMarkedRead from "../../../middleware/social/chat/direct/confirm-message-not-already-marked-read"
import validateUpdatedMessageText from "../../../middleware/request-validation/social/chat/validate-updated-message-text"
import confirmDirectMessageChatDoesntExist from "../../../middleware/social/chat/direct/confirm-direct-message-chat-doesnt-exist"
import validateDirectMessageChatId from "../../../middleware/request-validation/social/chat/direct/validate-direct-message-chat-id"
import validateNewDirectMessageName from "../../../middleware/request-validation/social/chat/direct/validate-new-direct-message-name"
import confirmUserIsDirectMessageChatParticipant
	from "../../../middleware/social/chat/direct/confirm-user-is-direct-message-chat-participant"

import sendDirectMessage from "../../../controllers/social/chat/direct/send-direct-message"
import updateDirectMessage from "../../../controllers/social/chat/direct/update-direct-message"
import replyToDirectMessage from "../../../controllers/social/chat/direct/reply-to-direct-message"
import createDirectMessageChat from "../../../controllers/social/chat/direct/create-direct-mesage-chat"
import markDirectMessageAsRead from "../../../controllers/social/chat/direct/mark-direct-message-as-read"
import editDirectMessageChatName from "../../../controllers/social/chat/direct/edit-direct-message-chat-name"
import retrieveDirectMessageChats from "../../../controllers/social/chat/direct/retrieve-direct-message-chats"
import retrieveDirectMessagesFromChat from "../../../controllers/social/chat/direct/retrieve-direct-messages-from-chat"

const directMessagesRoutes = express.Router()

directMessagesRoutes.post(
	"/create-message-chat",
	validateFriendId,
	confirmUserHasntBlockedFriend,
	confirmFriendHasntBlockedUser,
	confirmUsersAreFriends,
	confirmDirectMessageChatDoesntExist,
	createDirectMessageChat
)

directMessagesRoutes.post(
	"/send-message",
	validateDirectMessageChatId,
	validateDirectMessage,
	extractFriendFromChat,
	confirmUserIsDirectMessageChatParticipant,
	confirmUserHasntBlockedFriend,
	confirmFriendHasntBlockedUser,
	confirmUsersAreFriends,
	sendDirectMessage
)

directMessagesRoutes.get("/retrieve-message-chats", retrieveDirectMessageChats)

directMessagesRoutes.post(
	"/mark-message-as-read",
	validateDirectMessageId,
	confirmUserIsDirectMessageChatParticipant,
	confirmMessageSentByOtherUser,
	confirmMessageNotAlreadyMarkedRead,
	markDirectMessageAsRead
)

directMessagesRoutes.post(
	"/update-message",
	validateDirectMessageId,
	validateUpdatedMessageText,
	confirmMessageSentByUser,
	updateDirectMessage
)

directMessagesRoutes.post(
	"/edit-message-chat-name",
	validateDirectMessageChatId,
	validateNewDirectMessageName,
	confirmUserIsDirectMessageChatParticipant,
	editDirectMessageChatName
)

directMessagesRoutes.get(
	"/retrieve-messages-from-chat",
	validateDirectMessageChatId,
	confirmUserIsDirectMessageChatParticipant,
	retrieveDirectMessagesFromChat
)

directMessagesRoutes.post(
	"/reply-to-message",
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

export default directMessagesRoutes

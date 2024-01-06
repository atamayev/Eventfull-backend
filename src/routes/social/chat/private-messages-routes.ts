import express from "express"

import validateFriendId from "../../../middleware/request-validation/social/validate-friend-id"
import confirmUsersAreFriends from "../../../middleware/social/friend/confirm-users-are-friends"
import extractFriendFromChat from "../../../middleware/social/chat/private/extract-friend-from-chat"
import confirmUserHasntBlockedFriend from "../../../middleware/social/friend/confirm-user-hasnt-blocked-friend"
import confirmFriendHasntBlockedUser from "../../../middleware/social/friend/confirm-friend-hasnt-blocked-user"
import confirmPrivateChatDoesntExist from "../../../middleware/social/chat/private/confirm-private-chat-doesnt-exist"
import validatePrivateMessage from "../../../middleware/request-validation/social/chat/private/validate-private-message"
import validateUpdatedMessageText from "../../../middleware/request-validation/social/chat/validate-updated-message-text"
import confirmPrivateMessageSentByUser from "../../../middleware/social/chat/private/confirm-private-message-sent-by-user"
import validatePrivateMessageId from "../../../middleware/request-validation/social/chat/private/validate-private-message-id"
import validatePrivateChatId from "../../../middleware/request-validation/social/chat/private/validate-private-chat-id"
import confirmUserIsPrivateChatParticipant from "../../../middleware/social/chat/private/confirm-user-is-private-chat-participant"
import confirmPrivateMessageSentByOtherUser from "../../../middleware/social/chat/private/confirm-private-message-sent-by-other-user"
import validateUpdatedPrivateChatName from "../../../middleware/request-validation/social/chat/private/validate-updated-private-chat-name"
import confirmPrivateMessageNotAlreadyMarkedRead
	from "../../../middleware/social/chat/private/confirm-private-message-not-already-marked-read"

import sendPrivateMessage from "../../../controllers/social/chat/private/send-private-message"
import createPrivateChat from "../../../controllers/social/chat/private/create-private-chat"
import editPrivateChatName from "../../../controllers/social/chat/private/edit-private-chat-name"
import updatePrivateMessage from "../../../controllers/social/chat/private/update-private-message"
import retrievePrivateChats from "../../../controllers/social/chat/private/retrieve-private-chats"
import replyToPrivateMessage from "../../../controllers/social/chat/private/reply-to-private-message"
import markPrivateMessageAsRead from "../../../controllers/social/chat/private/mark-private-message-as-read"
import retrievePrivateChatMessages from "../../../controllers/social/chat/private/retrieve-private-chat-messages"

const privateMessagesRoutes = express.Router()

privateMessagesRoutes.post(
	"/create-message-chat",
	validateFriendId,
	confirmUserHasntBlockedFriend,
	confirmFriendHasntBlockedUser,
	confirmUsersAreFriends,
	confirmPrivateChatDoesntExist,
	createPrivateChat
)

privateMessagesRoutes.post(
	"/send-message",
	validatePrivateChatId,
	validatePrivateMessage,
	extractFriendFromChat,
	confirmUserIsPrivateChatParticipant,
	confirmUserHasntBlockedFriend,
	confirmFriendHasntBlockedUser,
	confirmUsersAreFriends,
	sendPrivateMessage
)

privateMessagesRoutes.get("/retrieve-chats-list", retrievePrivateChats)

privateMessagesRoutes.post(
	"/mark-message-as-read",
	validatePrivateMessageId,
	confirmUserIsPrivateChatParticipant,
	confirmPrivateMessageSentByOtherUser,
	confirmPrivateMessageNotAlreadyMarkedRead,
	markPrivateMessageAsRead
)

privateMessagesRoutes.post(
	"/update-message",
	validatePrivateMessageId,
	validateUpdatedMessageText,
	confirmPrivateMessageSentByUser,
	updatePrivateMessage
)

privateMessagesRoutes.post(
	"/edit-chat-name",
	validatePrivateChatId,
	validateUpdatedPrivateChatName,
	confirmUserIsPrivateChatParticipant,
	editPrivateChatName
)

privateMessagesRoutes.get(
	"/retrieve-messages-from-chat",
	validatePrivateChatId,
	confirmUserIsPrivateChatParticipant,
	retrievePrivateChatMessages
)

privateMessagesRoutes.post(
	"/reply-to-message",
	validatePrivateChatId,
	validatePrivateMessageId,
	validatePrivateMessage,
	extractFriendFromChat,
	confirmUserIsPrivateChatParticipant,
	confirmUserHasntBlockedFriend,
	confirmFriendHasntBlockedUser,
	confirmUsersAreFriends,
	replyToPrivateMessage
)

export default privateMessagesRoutes

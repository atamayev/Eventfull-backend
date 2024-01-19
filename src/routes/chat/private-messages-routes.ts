import express from "express"

import validateFriendId from "../../middleware/request-validation/social/validate-friend-id"
import confirmUsersAreFriends from "../../middleware/social/friend/confirm-users-are-friends"
import extractFriendFromChat from "../../middleware/social/chat/private/extract-friend-from-chat"
import confirmUserHasntBlockedFriend from "../../middleware/social/friend/confirm-user-hasnt-blocked-friend"
import confirmFriendHasntBlockedUser from "../../middleware/social/friend/confirm-friend-hasnt-blocked-user"
import confirmPrivateChatDoesntExist from "../../middleware/social/chat/private/confirm-private-chat-doesnt-exist"
import validatePrivateChatId from "../../middleware/request-validation/social/chat/private/validate-private-chat-id"
import validatePrivateMessage from "../../middleware/request-validation/social/chat/private/validate-private-message"
import validateUpdatedMessageText from "../../middleware/request-validation/social/chat/validate-updated-message-text"
import confirmPrivateMessageSentByUser from "../../middleware/social/chat/private/confirm-private-message-sent-by-user"
import validatePrivateMessageId from "../../middleware/request-validation/social/chat/private/validate-private-message-id"
import confirmUserIsPrivateChatParticipant from "../../middleware/social/chat/private/confirm-user-is-private-chat-participant"
import confirmPrivateMessageSentByOtherUser from "../../middleware/social/chat/private/confirm-private-message-sent-by-other-user"
import confirmNewPrivateMessageStatus from "../../middleware/social/chat/private/confirm-private-message-status-is-new"
import validatePrivateChatIdInParams from "../../middleware/request-validation/social/chat/private/validate-private-chat-id-in-params"
import validateUpdatedPrivateChatName from "../../middleware/request-validation/social/chat/private/validate-updated-private-chat-name"

import createPrivateChat from "../../controllers/chat/private/chat/create-private-chat"
import editPrivateChatName from "../../controllers/chat/private/chat/edit-private-chat-name"
import sendPrivateMessage from "../../controllers/chat/private/message/send-private-message"
import retrievePrivateChats from "../../controllers/chat/private/chat/retrieve-private-chats"
import deletePrivateMessage from "../../controllers/chat/private/message/delete-private-message"
import updatePrivateMessage from "../../controllers/chat/private/message/update-private-message"
import replyToPrivateMessage from "../../controllers/chat/private/message/reply-to-private-message"
import updatePrivateMessageStatus from "../../controllers/chat/private/message/update-private-message-status"
import retrievePrivateChatMessages from "../../controllers/chat/private/message/retrieve-private-chat-messages"
import validateUpdatedMessageStatus from "../../middleware/request-validation/social/chat/validate-updated-message-status"
import retrieveSinglePrivateChat from "../../controllers/chat/private/chat/retrieve-single-private-chat"
import validateMessagePaginationQueryParams from "../../middleware/request-validation/social/chat/validate-message-pagination-query-params"

const privateMessagesRoutes = express.Router()

privateMessagesRoutes.post(
	"/create-chat",
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

privateMessagesRoutes.get(
	"/retrieve-single-chat/:privateChatId",
	validatePrivateChatIdInParams,
	confirmUserIsPrivateChatParticipant,
	retrieveSinglePrivateChat
)

// This endpoint is used to mark a message as delivered or read
privateMessagesRoutes.post(
	"/update-message-status",
	validatePrivateMessageId,
	validateUpdatedMessageStatus,
	confirmUserIsPrivateChatParticipant,
	confirmPrivateMessageSentByOtherUser,
	confirmNewPrivateMessageStatus,
	updatePrivateMessageStatus
)

privateMessagesRoutes.post(
	"/update-message",
	validatePrivateMessageId,
	validateUpdatedMessageText,
	confirmPrivateMessageSentByUser,
	updatePrivateMessage
)

privateMessagesRoutes.post("/delete-message", validatePrivateMessageId, confirmPrivateMessageSentByUser, deletePrivateMessage)

privateMessagesRoutes.post(
	"/edit-chat-name",
	validatePrivateChatId,
	validateUpdatedPrivateChatName,
	confirmUserIsPrivateChatParticipant,
	editPrivateChatName
)

privateMessagesRoutes.get(
	"/retrieve-messages-from-chat/:privateChatId",
	validatePrivateChatIdInParams,
	validateMessagePaginationQueryParams,
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

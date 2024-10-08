import express from "express"

import extractFriendFromChat from "../../middleware/chat/private/extract-friend-from-chat"
import validateFriendId from "../../middleware/request-validation/social/validate-friend-id"
import confirmUsersAreFriends from "../../middleware/social/friend/confirm-users-are-friends"
import confirmPrivateChatDoesntExist from "../../middleware/chat/private/confirm-private-chat-doesnt-exist"
import confirmFriendHasntBlockedUser from "../../middleware/social/friend/confirm-friend-hasnt-blocked-user"
import confirmUserHasntBlockedFriend from "../../middleware/social/friend/confirm-user-hasnt-blocked-friend"
import confirmPrivateMessageSentByUser from "../../middleware/chat/private/confirm-private-message-sent-by-user"
import confirmPrivateMessageStatusIsNew from "../../middleware/chat/private/confirm-private-message-status-is-new"
import validatePrivateMessage from "../../middleware/request-validation/chat/private/validate-private-message"
import validateUpdatedMessageText from "../../middleware/request-validation/chat/validate-updated-message-text"
import confirmUserIsPrivateChatParticipant from "../../middleware/chat/private/confirm-user-is-private-chat-participant"
import validateUpdatedMessageStatus from "../../middleware/request-validation/chat/validate-updated-message-status"
import confirmPrivateMessageSentByOtherUser from "../../middleware/chat/private/confirm-private-message-sent-by-other-user"
import validatePrivateChatIdInParams from "../../middleware/request-validation/chat/private/validate-private-chat-id-in-params"
import validateUpdatedPrivateChatName from "../../middleware/request-validation/chat/private/validate-updated-private-chat-name"
import validateMessagePaginationQueryParams from "../../middleware/request-validation/chat/validate-message-pagination-query-params"
import validatePrivateMessageIdInParams from "../../middleware/request-validation/chat/private/validate-private-message-id-in-params"

import createPrivateChat from "../../controllers/chat/private/chat/create-private-chat"
import editPrivateChatName from "../../controllers/chat/private/chat/edit-private-chat-name"
import sendPrivateMessage from "../../controllers/chat/private/message/send-private-message"
import retrievePrivateChats from "../../controllers/chat/private/chat/retrieve-private-chats"
import deletePrivateMessage from "../../controllers/chat/private/message/delete-private-message"
import updatePrivateMessage from "../../controllers/chat/private/message/update-private-message"
import replyToPrivateMessage from "../../controllers/chat/private/message/reply-to-private-message"
import retrieveSinglePrivateChat from "../../controllers/chat/private/chat/retrieve-single-private-chat"
import updatePrivateMessageStatus from "../../controllers/chat/private/message/update-private-message-status"
import retrieveSinglePrivateMessage from "../../controllers/chat/private/chat/retrieve-single-private-message"
import retrievePrivateChatMessages from "../../controllers/chat/private/message/retrieve-private-chat-messages"

const privateMessagesRoutes = express.Router()

privateMessagesRoutes.post(
	"/create-chat/:friendId",
	validateFriendId,
	confirmUserHasntBlockedFriend,
	confirmFriendHasntBlockedUser,
	confirmUsersAreFriends,
	confirmPrivateChatDoesntExist,
	createPrivateChat
)

privateMessagesRoutes.post(
	"/send-message/:privateChatId",
	validatePrivateMessage,
	validatePrivateChatIdInParams,
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

privateMessagesRoutes.get(
	"/retrieve-single-message/:privateMessageId",
	validatePrivateMessageIdInParams,
	confirmUserIsPrivateChatParticipant,
	retrieveSinglePrivateMessage
)

// This endpoint is used to mark a message as delivered or read
privateMessagesRoutes.post(
	"/update-message-status/:privateMessageId",
	validateUpdatedMessageStatus,
	validatePrivateMessageIdInParams,
	confirmUserIsPrivateChatParticipant,
	confirmPrivateMessageSentByOtherUser,
	confirmPrivateMessageStatusIsNew,
	updatePrivateMessageStatus
)

privateMessagesRoutes.post(
	"/update-message/:privateMessageId",
	validateUpdatedMessageText,
	validatePrivateMessageIdInParams,
	confirmUserIsPrivateChatParticipant,
	confirmPrivateMessageSentByUser,
	updatePrivateMessage
)

privateMessagesRoutes.delete(
	"/delete-message/:privateMessageId",
	validatePrivateMessageIdInParams,
	confirmUserIsPrivateChatParticipant,
	confirmPrivateMessageSentByUser,
	deletePrivateMessage
)

privateMessagesRoutes.post(
	"/edit-chat-name/:privateChatId",
	validateUpdatedPrivateChatName,
	validatePrivateChatIdInParams,
	confirmUserIsPrivateChatParticipant,
	editPrivateChatName
)

privateMessagesRoutes.get(
	"/retrieve-messages-from-chat/:privateChatId",
	validateMessagePaginationQueryParams,
	validatePrivateChatIdInParams,
	confirmUserIsPrivateChatParticipant,
	retrievePrivateChatMessages
)

privateMessagesRoutes.post(
	"/reply-to-message/:privateMessageId",
	validatePrivateMessage,
	validatePrivateMessageIdInParams,
	extractFriendFromChat,
	confirmUserIsPrivateChatParticipant,
	confirmUserHasntBlockedFriend,
	confirmFriendHasntBlockedUser,
	confirmUsersAreFriends,
	replyToPrivateMessage
)

export default privateMessagesRoutes

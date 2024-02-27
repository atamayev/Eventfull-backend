import express from "express"

import extractFriendsFromChat from "../../middleware/chat/group/extract-friends-from-chat"
import confirmGroupChatDoesntExist from "../../middleware/chat/group/confirm-group-chat-doesnt-exist"
import validateFriendIds from "../../middleware/request-validation/chat/group/validate-friend-ids"
import confirmGroupMessageSentByUser from "../../middleware/chat/group/confirm-group-message-sent-by-user"
import confirmGroupMessageStatusIsNew from "../../middleware/chat/group/confirm-group-message-status-is-new"
import validateGroupMessage from "../../middleware/request-validation/chat/group/validate-group-message"
import confirmUserHasntBlockedAnyFriend from "../../middleware/chat/group/confirm-user-hasnt-blocked-any-friend"
import confirmUserIsGroupChatParticipant from "../../middleware/chat/group/confirm-user-is-group-chat-participant"
import confirmGroupMessageSentByOtherUser from "../../middleware/chat/group/confirm-group-message-sent-by-other-user"
import validateUpdatedMessageText from "../../middleware/request-validation/chat/validate-updated-message-text"
import validateUpdatedMessageStatus from "../../middleware/request-validation/chat/validate-updated-message-status"
import confirmFriendsHaveNotBlockedEachother from "../../middleware/chat/group/confirm-friends-have-not-blocked-eachother"
import confirmUserIsFriendsWithEachParticipant from "../../middleware/chat/group/confirm-user-is-friends-with-each-participant"
import validateGroupChatIdInParams from "../../middleware/request-validation/chat/group/validate-group-chat-id-in-params"
import validateUpdatedGroupChatName	from "../../middleware/request-validation/chat/group/validate-updated-group-chat-name"
import validateGroupMessageIdInParams from "../../middleware/request-validation/chat/group/validate-group-message-id-in-params"
import validateMessagePaginationQueryParams from "../../middleware/request-validation/chat/validate-message-pagination-query-params"

import createGroupChat from "../../controllers/chat/group/chat/create-group-chat"
import sendGroupMessage from "../../controllers/chat/group/message/send-group-message"
import editGroupChatName from "../../controllers/chat/group/chat/edit-group-chat-name"
import retrieveGroupChats from "../../controllers/chat/group/chat/retrieve-group-chats"
import deleteGroupMessage from "../../controllers/chat/group/message/delete-group-message"
import updateGroupMessage from "../../controllers/chat/group/message/update-group-message"
import replyToGroupMessage from "../../controllers/chat/group/message/reply-to-group-message"
import retrieveSingleGroupChat from "../../controllers/chat/group/chat/retrieve-single-group-chat"
import updateGroupMessageStatus from "../../controllers/chat/group/message/update-group-message-status"
import retrieveSingleGroupMessage from "../../controllers/chat/group/chat/retrieve-single-group-message"
import retrieveGroupChatMessages from "../../controllers/chat/group/message/retrieve-group-chat-messages"

const groupMessagesRoutes = express.Router()

groupMessagesRoutes.post(
	"/create-chat",
	validateFriendIds,
	confirmUserHasntBlockedAnyFriend,
	confirmFriendsHaveNotBlockedEachother,
	confirmUserIsFriendsWithEachParticipant,
	confirmGroupChatDoesntExist,
	createGroupChat
)

groupMessagesRoutes.post(
	"/send-message/:groupChatId",
	validateGroupMessage,
	validateGroupChatIdInParams,
	extractFriendsFromChat,
	confirmUserIsGroupChatParticipant,
	confirmUserHasntBlockedAnyFriend,
	confirmFriendsHaveNotBlockedEachother,
	sendGroupMessage
)

groupMessagesRoutes.get("/retrieve-chats-list", retrieveGroupChats)

groupMessagesRoutes.get(
	"/retrieve-single-chat/:groupChatId",
	validateGroupChatIdInParams,
	confirmUserIsGroupChatParticipant,
	retrieveSingleGroupChat
)

groupMessagesRoutes.get(
	"/retrieve-single-message/:groupMessageId",
	validateGroupMessageIdInParams,
	confirmUserIsGroupChatParticipant,
	retrieveSingleGroupMessage
)

// This endpoint is used to mark a message as delivered or read
groupMessagesRoutes.post(
	"/update-message-status/:groupMessageId",
	validateUpdatedMessageStatus,
	validateGroupMessageIdInParams,
	confirmUserIsGroupChatParticipant,
	confirmGroupMessageSentByOtherUser,
	confirmGroupMessageStatusIsNew,
	updateGroupMessageStatus
)

groupMessagesRoutes.post(
	"/update-message/:groupMessageId",
	validateUpdatedMessageText,
	validateGroupMessageIdInParams,
	confirmUserIsGroupChatParticipant,
	confirmGroupMessageSentByUser,
	updateGroupMessage
)

groupMessagesRoutes.delete(
	"/delete-message/:groupMessageId",
	validateGroupMessageIdInParams,
	confirmUserIsGroupChatParticipant,
	confirmGroupMessageSentByUser,
	deleteGroupMessage
)

groupMessagesRoutes.post(
	"/edit-chat-name/:groupChatId",
	validateUpdatedGroupChatName,
	validateGroupChatIdInParams,
	confirmUserIsGroupChatParticipant,
	editGroupChatName
)

groupMessagesRoutes.get(
	"/retrieve-messages-from-chat/:groupChatId",
	validateMessagePaginationQueryParams,
	validateGroupChatIdInParams,
	confirmUserIsGroupChatParticipant,
	retrieveGroupChatMessages
)

groupMessagesRoutes.post(
	"/reply-to-message/:groupMessageId",
	validateGroupMessage,
	validateGroupMessageIdInParams,
	extractFriendsFromChat,
	confirmUserIsGroupChatParticipant,
	confirmUserHasntBlockedAnyFriend,
	confirmFriendsHaveNotBlockedEachother,
	replyToGroupMessage
)

export default groupMessagesRoutes

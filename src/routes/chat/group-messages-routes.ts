import express from "express"

import extractFriendsFromChat from "../../middleware/social/chat/group/extract-friends-from-chat"
import validateFriendIds from "../../middleware/request-validation/social/chat/group/validate-friend-ids"
import confirmGroupChatDoesntExist from "../../middleware/social/chat/group/confirm-group-chat-doesnt-exist"
import validateGroupMessage from "../../middleware/request-validation/social/chat/group/validate-group-message"
import confirmGroupMessageSentByUser from "../../middleware/social/chat/group/confirm-group-message-sent-by-user"
import confirmGroupMessageStatusIsNew from "../../middleware/social/chat/group/confirm-group-message-status-is-new"
import validateUpdatedMessageText from "../../middleware/request-validation/social/chat/validate-updated-message-text"
import confirmUserHasntBlockedAnyFriend from "../../middleware/social/chat/group/confirm-user-hasnt-blocked-any-friend"
import confirmUserIsGroupChatParticipant from "../../middleware/social/chat/group/confirm-user-is-group-chat-participant"
import validateUpdatedMessageStatus from "../../middleware/request-validation/social/chat/validate-updated-message-status"
import confirmGroupMessageSentByOtherUser from "../../middleware/social/chat/group/confirm-group-message-sent-by-other-user"
import validateGroupChatIdInParams from "../../middleware/request-validation/social/chat/group/validate-group-chat-id-in-params"
import validateUpdatedGroupChatName	from "../../middleware/request-validation/social/chat/group/validate-updated-group-chat-name"
import confirmFriendsHaveNotBlockedEachother from "../../middleware/social/chat/group/confirm-friends-have-not-blocked-eachother"
import validateGroupMessageIdInParams from "../../middleware/request-validation/social/chat/group/validate-group-message-id-in-params"
import confirmUserIsFriendsWithEachParticipant from "../../middleware/social/chat/group/confirm-user-is-friends-with-each-participant"
import validateMessagePaginationQueryParams from "../../middleware/request-validation/social/chat/validate-message-pagination-query-params"

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

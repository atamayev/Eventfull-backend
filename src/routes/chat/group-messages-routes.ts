import express from "express"

import extractFriendsFromChat from "../../middleware/social/chat/group/extract-friends-from-chat"
import validateFriendIds from "../../middleware/request-validation/social/chat/group/validate-friend-ids"
import confirmGroupChatDoesntExist from "../../middleware/social/chat/group/confirm-group-chat-doesnt-exist"
import validateGroupMessage from "../../middleware/request-validation/social/chat/group/validate-group-message"
import confirmGroupMessageSentByUser from "../../middleware/social/chat/group/confirm-group-message-sent-by-user"
import validateGroupMessageId from "../../middleware/request-validation/social/chat/group/validate-group-message-id"
import validateGroupChatId from "../../middleware/request-validation/social/chat/group/validate-group-message-chat-id"
import validateUpdatedMessageText from "../../middleware/request-validation/social/chat/validate-updated-message-text"
import confirmUserHasntBlockedAnyFriend from "../../middleware/social/chat/group/confirm-user-hasnt-blocked-any-friend"
import confirmUserIsGroupChatParticipant from "../../middleware/social/chat/group/confirm-user-is-group-chat-participant"
import confirmUserIsFriendsWithEachFriend from "../../middleware/social/chat/group/confirm-user-is-friends-with-each-friend"
import confirmGroupMessageSentByOtherUser from "../../middleware/social/chat/group/confirm-group-message-sent-by-other-user"
import confirmFriendsHaveNotBlockedEachother from "../../middleware/social/chat/group/confirm-friends-have-not-blocked-eachother"
import validateUpdatedGroupChatName	from "../../middleware/request-validation/social/chat/group/validate-updated-group-chat-name"
import confirmGroupMessageNotAlreadyMarkedRead from "../../middleware/social/chat/group/confirm-group-message-not-already-marked-read"
import validateGroupChatIdInParams from "../../middleware/request-validation/social/chat/group/validate-group-message-chat-id-in-params"

import createGroupChat from "../../controllers/chat/group/create-group-chat"
import sendGroupMessage from "../../controllers/chat/group/send-group-message"
import editGroupChatName from "../../controllers/chat/group/edit-group-chat-name"
import retrieveGroupChats from "../../controllers/chat/group/retrieve-group-chats"
import updateGroupMessage from "../../controllers/chat/group/update-group-message"
import replyToGroupMessage from "../../controllers/chat/group/reply-to-group-message"
import markGroupMessageRead from "../../controllers/chat/group/mark-group-message-read"
import retrieveMessagesFromGroupChat from "../../controllers/chat/group/retrieve-messages-from-group-chat"

const groupMessagesRoutes = express.Router()

groupMessagesRoutes.post(
	"/create-chat",
	validateFriendIds,
	confirmUserHasntBlockedAnyFriend,
	confirmFriendsHaveNotBlockedEachother,
	confirmUserIsFriendsWithEachFriend,
	confirmGroupChatDoesntExist,
	createGroupChat
)

groupMessagesRoutes.post(
	"/send-message",
	validateGroupChatId,
	validateGroupMessage,
	extractFriendsFromChat,
	confirmUserIsGroupChatParticipant,
	confirmUserHasntBlockedAnyFriend,
	confirmFriendsHaveNotBlockedEachother,
	sendGroupMessage
)

groupMessagesRoutes.get("/retrieve-chats-list", retrieveGroupChats)

groupMessagesRoutes.post(
	"/mark-message-read",
	validateGroupMessageId,
	confirmUserIsGroupChatParticipant,
	confirmGroupMessageSentByOtherUser,
	confirmGroupMessageNotAlreadyMarkedRead,
	markGroupMessageRead
)

groupMessagesRoutes.post(
	"/update-message",
	validateGroupMessageId,
	validateUpdatedMessageText,
	confirmGroupMessageSentByUser,
	updateGroupMessage
)

groupMessagesRoutes.post(
	"/edit-chat-name",
	validateGroupChatId,
	validateUpdatedGroupChatName,
	confirmUserIsGroupChatParticipant,
	editGroupChatName
)

groupMessagesRoutes.get(
	"/retrieve-messages-from-chat/:groupChatId",
	validateGroupChatIdInParams,
	confirmUserIsGroupChatParticipant,
	retrieveMessagesFromGroupChat
)

groupMessagesRoutes.post(
	"/reply-to-message",
	validateGroupChatId,
	validateGroupMessageId,
	validateGroupMessage,
	extractFriendsFromChat,
	confirmUserIsGroupChatParticipant,
	confirmUserHasntBlockedAnyFriend,
	confirmFriendsHaveNotBlockedEachother,
	replyToGroupMessage
)

export default groupMessagesRoutes

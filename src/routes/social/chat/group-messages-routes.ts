import express from "express"

import extractFriendsFromChat from "../../../middleware/social/chat/group/extract-friends-from-chat"
import validateFriendIds from "../../../middleware/request-validation/social/chat/group/validate-friend-ids"
import validateGroupMessage from "../../../middleware/request-validation/social/chat/group/validate-group-message"
import confirmUserHasntBlockedAnyFriend from "../../../middleware/social/chat/group/confirm-user-hasnt-blocked-any-friend"
import confirmGroupMessageChatDoesntExist from "../../../middleware/social/chat/group/confirm-group-message-chat-doesnt-exist"
import confirmUserIsFriendsWithEachFriend from "../../../middleware/social/chat/group/confirm-user-is-friends-with-each-friend"
import validateGroupMessageChatId from "../../../middleware/request-validation/social/chat/group/validate-group-message-chat-id"
import confirmFriendsHaveNotBlockedEachother from "../../../middleware/social/chat/group/confirm-friends-have-not-blocked-eachother"
import confirmUserIsGroupMessageChatParticipant from "../../../middleware/social/chat/group/confirm-user-is-group-message-chat-participant"
import validateGroupMessageId from "../../../middleware/request-validation/social/chat/group/validate-group-message-id"
import confirmGroupMessageSentByOtherUser from "../../../middleware/social/chat/group/confirm-group-message-sent-by-other-user"
import confirmGroupMessageNotAlreadyMarkedRead from "../../../middleware/social/chat/group/confirm-group-message-not-already-marked-read"
import validateUpdatedMessageText from "../../../middleware/request-validation/social/chat/validate-updated-message-text"
import confirmGroupMessageSentByUser from "../../../middleware/social/chat/group/confirm-group-message-sent-by-user"
import validateNewGroupMessageChatName
	from "../../../middleware/request-validation/social/chat/direct/validate-new-direct-message-chat-name"

import sendGroupMessage from "../../../controllers/social/chat/group/send-group-message"
import updateGroupMessage from "../../../controllers/social/chat/group/update-group-message"
import createGroupChat from "../../../controllers/social/chat/group/create-group-chat"
import markGroupMessageAsRead from "../../../controllers/social/chat/group/mark-group-message-as-read"
import editGroupChatName from "../../../controllers/social/chat/group/edit-group-chat-name"
import retrieveGroupChats from "../../../controllers/social/chat/group/retrieve-group-chats"

const groupMessagesRoutes = express.Router()

groupMessagesRoutes.post(
	"/create-message-chat",
	validateFriendIds,
	confirmUserHasntBlockedAnyFriend,
	confirmFriendsHaveNotBlockedEachother,
	confirmUserIsFriendsWithEachFriend,
	confirmGroupMessageChatDoesntExist,
	createGroupChat
)

groupMessagesRoutes.post(
	"/send-message",
	validateGroupMessageChatId,
	validateGroupMessage,
	extractFriendsFromChat,
	confirmUserIsGroupMessageChatParticipant,
	confirmUserHasntBlockedAnyFriend,
	confirmFriendsHaveNotBlockedEachother,
	sendGroupMessage
)

groupMessagesRoutes.get("/retrieve-chats-list", retrieveGroupChats)

groupMessagesRoutes.post(
	"/mark-message-as-read",
	validateGroupMessageId,
	confirmUserIsGroupMessageChatParticipant,
	confirmGroupMessageSentByOtherUser,
	confirmGroupMessageNotAlreadyMarkedRead,
	markGroupMessageAsRead
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
	validateGroupMessageChatId,
	validateNewGroupMessageChatName,
	confirmUserIsGroupMessageChatParticipant,
	editGroupChatName
)

export default groupMessagesRoutes

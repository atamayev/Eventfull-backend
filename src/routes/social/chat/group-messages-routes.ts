import express from "express"

import extractFriendsFromChat from "../../../middleware/social/chat/group/extract-friends-from-chat"
import validateFriendIds from "../../../middleware/request-validation/social/chat/group/validate-friend-ids"
import validateGroupMessage from "../../../middleware/request-validation/social/chat/group/validate-group-message"
import confirmUserHasntBlockedAnyFriend from "../../../middleware/social/chat/group/confirm-user-hasnt-blocked-any-friend"
import confirmGroupChatDoesntExist from "../../../middleware/social/chat/group/confirm-group-message-chat-doesnt-exist"
import confirmUserIsFriendsWithEachFriend from "../../../middleware/social/chat/group/confirm-user-is-friends-with-each-friend"
import validateGroupChatId from "../../../middleware/request-validation/social/chat/group/validate-group-message-chat-id"
import confirmFriendsHaveNotBlockedEachother from "../../../middleware/social/chat/group/confirm-friends-have-not-blocked-eachother"
import confirmUserIsGroupChatParticipant from "../../../middleware/social/chat/group/confirm-user-is-group-message-chat-participant"
import validateGroupMessageId from "../../../middleware/request-validation/social/chat/group/validate-group-message-id"
import confirmGroupMessageSentByOtherUser from "../../../middleware/social/chat/group/confirm-group-message-sent-by-other-user"
import confirmGroupMessageNotAlreadyMarkedRead from "../../../middleware/social/chat/group/confirm-group-message-not-already-marked-read"
import validateUpdatedMessageText from "../../../middleware/request-validation/social/chat/validate-updated-message-text"
import confirmGroupMessageSentByUser from "../../../middleware/social/chat/group/confirm-group-message-sent-by-user"
import validateNewGroupChatName
	from "../../../middleware/request-validation/social/chat/group/validate-new-group-message-chat-name"

import sendGroupMessage from "../../../controllers/social/chat/group/send-group-message"
import updateGroupMessage from "../../../controllers/social/chat/group/update-group-message"
import createGroupChat from "../../../controllers/social/chat/group/create-group-chat"
import markGroupMessageAsRead from "../../../controllers/social/chat/group/mark-group-message-as-read"
import editGroupChatName from "../../../controllers/social/chat/group/edit-group-chat-name"
import retrieveGroupChats from "../../../controllers/social/chat/group/retrieve-group-chats"
import retrieveMessagesFromGroupChat from "../../../controllers/social/chat/group/retrieve-messages-from-group-chat"

const groupMessagesRoutes = express.Router()

groupMessagesRoutes.post(
	"/create-message-chat",
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
	"/mark-message-as-read",
	validateGroupMessageId,
	confirmUserIsGroupChatParticipant,
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
	validateGroupChatId,
	validateNewGroupChatName,
	confirmUserIsGroupChatParticipant,
	editGroupChatName
)

groupMessagesRoutes.get(
	"/retrieve-messages-from-chat",
	validateGroupChatId,
	confirmUserIsGroupChatParticipant,
	retrieveMessagesFromGroupChat
)

export default groupMessagesRoutes

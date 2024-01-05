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

import sendGroupMessage from "../../../controllers/social/chat/group/send-group-message"
import createGroupMessageChat from "../../../controllers/social/chat/group/create-group-message-chat"

const groupMessagesRoutes = express.Router()

groupMessagesRoutes.post(
	"/create-message-chat",
	validateFriendIds,
	confirmUserHasntBlockedAnyFriend,
	confirmFriendsHaveNotBlockedEachother,
	confirmUserIsFriendsWithEachFriend,
	confirmGroupMessageChatDoesntExist,
	createGroupMessageChat
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

export default groupMessagesRoutes

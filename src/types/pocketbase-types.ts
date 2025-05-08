/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Authorigins = "_authOrigins",
	Externalauths = "_externalAuths",
	Mfas = "_mfas",
	Otps = "_otps",
	Superusers = "_superusers",
	Feed = "feed",
	Follows = "follows",
	Likes = "likes",
	Posts = "posts",
	Profiles = "profiles",
	Test = "test",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

type ExpandType<T> = unknown extends T
	? T extends unknown
		? { expand?: unknown }
		: { expand: T }
	: { expand: T }

// System fields
export type BaseSystemFields<T = unknown> = {
	id: RecordIdString
	collectionId: string
	collectionName: Collections
} & ExpandType<T>

export type AuthSystemFields<T = unknown> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AuthoriginsRecord = {
	collectionRef: string
	created?: IsoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated?: IsoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated?: IsoDateString
}

export type MfasRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	method: string
	recordRef: string
	updated?: IsoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated?: IsoDateString
}

export type SuperusersRecord = {
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

export type FeedRecord<Tlikes = unknown> = {
	author: RecordIdString
	body?: HTMLString
	created?: IsoDateString
	id: string
	image: string
	likes?: null | Tlikes
	pinned?: boolean
	updated?: IsoDateString
}

export type FollowsRecord = {
	created?: IsoDateString
	followee: RecordIdString
	follower: RecordIdString
	id: string
	updated?: IsoDateString
}

export type LikesRecord = {
	created?: IsoDateString
	id: string
	post: RecordIdString
	updated?: IsoDateString
	user: RecordIdString
}

export type PostsRecord = {
	author: RecordIdString
	body?: HTMLString
	created?: IsoDateString
	id: string
	image: string
	pinned?: boolean
	updated?: IsoDateString
}

export type ProfilesRecord<Tfollowers = unknown, Tposts = unknown> = {
	avatar?: string
	email: string
	followers?: null | Tfollowers
	id: string
	name?: string
	posts?: null | Tposts
}

export type TestRecord = {
	created?: IsoDateString
	id: string
	pinned?: boolean
	updated?: IsoDateString
	user?: RecordIdString
}

export type UsersRecord = {
	avatar?: string
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	name?: string
	password: string
	private?: boolean
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type FeedResponse<Tlikes = unknown, Texpand = unknown> = Required<FeedRecord<Tlikes>> & BaseSystemFields<Texpand>
export type FollowsResponse<Texpand = unknown> = Required<FollowsRecord> & BaseSystemFields<Texpand>
export type LikesResponse<Texpand = unknown> = Required<LikesRecord> & BaseSystemFields<Texpand>
export type PostsResponse<Texpand = unknown> = Required<PostsRecord> & BaseSystemFields<Texpand>
export type ProfilesResponse<Tfollowers = unknown, Tposts = unknown, Texpand = unknown> = Required<ProfilesRecord<Tfollowers, Tposts>> & BaseSystemFields<Texpand>
export type TestResponse<Texpand = unknown> = Required<TestRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	feed: FeedRecord
	follows: FollowsRecord
	likes: LikesRecord
	posts: PostsRecord
	profiles: ProfilesRecord
	test: TestRecord
	users: UsersRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	feed: FeedResponse
	follows: FollowsResponse
	likes: LikesResponse
	posts: PostsResponse
	profiles: ProfilesResponse
	test: TestResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: '_authOrigins'): RecordService<AuthoriginsResponse>
	collection(idOrName: '_externalAuths'): RecordService<ExternalauthsResponse>
	collection(idOrName: '_mfas'): RecordService<MfasResponse>
	collection(idOrName: '_otps'): RecordService<OtpsResponse>
	collection(idOrName: '_superusers'): RecordService<SuperusersResponse>
	collection(idOrName: 'feed'): RecordService<FeedResponse>
	collection(idOrName: 'follows'): RecordService<FollowsResponse>
	collection(idOrName: 'likes'): RecordService<LikesResponse>
	collection(idOrName: 'posts'): RecordService<PostsResponse>
	collection(idOrName: 'profiles'): RecordService<ProfilesResponse>
	collection(idOrName: 'test'): RecordService<TestResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}

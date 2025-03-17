declare namespace Chat {
	interface Chat {
		dateTime: string;
		text: string;
		inversion?: boolean;
		error?: boolean;
		loading?: boolean;
		conversationOptions?: ConversationRequest | null;
		requestOptions: { prompt: string; options?: ConversationRequest | null };
		model?: string; //模型
		mjID?: string; //MJ的ID
		opt?: {
			progress?: string;
			seed?: number;
			imageUrl?: string;
			status?: string;
			images?: string[];
			promptEn?: string;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			buttons?: any[];
			action?: string;
			duration?: number;
			lkey?: string;
		}; //
		uuid?: number;
		index?: number;
		myid?: string; //唯一随机
		logo?: string;

		//progress?:string
	}

	interface History {
		title: string;
		isEdit: boolean;
		uuid: number;
		isGpts: boolean;
		model: string;
		modelName: string;
	}

	interface ChatState {
		active: number | null;
		usingContext: boolean;
		history: History[];
		chat: { uuid: number; data: Chat[] }[];
	}

	interface ConversationRequest {
		conversationId?: string;
		parentMessageId?: string;
	}

	interface ConversationResponse {
		conversationId: string;
		detail: {
			choices: {
				finish_reason: string;
				index: number;
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				logprobs: any;
				text: string;
			}[];
			created: number;
			id: string;
			model: string;
			object: string;
			usage: {
				completion_tokens: number;
				prompt_tokens: number;
				total_tokens: number;
			};
		};
		id: string;
		parentMessageId: string;
		role: string;
		text: string;
	}
}

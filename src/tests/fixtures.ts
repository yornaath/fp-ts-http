

export class UserRepository {
  static async find(opts: any) {
    return [{id: 1}]
  }
  static sendMessageToUser(user: {id: number}, message: {text: string}) {
    return {status: `sent message "${message.text}" to user: ${user.id}`}
  }
}
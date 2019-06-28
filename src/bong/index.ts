
import * as CreateBongDto from './dto/CreateBong.dto'
import { IO } from 'fp-ts/lib/IO';
import { task } from 'fp-ts/lib/Task'


const main = async () => {

  const input = new IO(() => `{
    "tokens": [
      {
        "id": "123"
      }
    ]
  }`);

  const validation = CreateBongDto.fromIO(input)
  const validationTask = task.of(validation);

  const result = await validationTask.run()

  console.log(result)
}

main()

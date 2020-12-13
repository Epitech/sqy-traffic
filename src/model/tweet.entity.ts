import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class TweetSchema {
  @PrimaryGeneratedColumn("uuid")
  id: number

  // Used to avoid duplication (ON CONFLICT DO NOTHING)
  // Will be soon used to avoid fetching unnecessary tweets (lastId url param)
  @Column({ unique: true })
  tweetId: string

  @Column()
  text: string

  @Column()
  accountName: string

  @Column()
  hasDisruption: boolean

  @Column()
  postedDate: Date
}

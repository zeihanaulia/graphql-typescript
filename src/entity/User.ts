import * as bcrypt from 'bcryptjs';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, BeforeInsert } from "typeorm";
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", { length: 255 })
  email: string;

  @Column("text")
  password: string;

  @Column("boolean", { default: false })
  confirmed: boolean;

  @BeforeInsert()
  async hashPassword() {
    console.log(this.password)
    this.password = await bcrypt.hash(this.password, 10)
    console.log(this.password)
  }
}
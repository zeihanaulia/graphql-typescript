import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert} from "typeorm";
import uuid4 from 'uuid/v4';
@Entity()
export class User {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;

    @BeforeInsert()
    addId() {
        this.id = uuid4();
    }

}

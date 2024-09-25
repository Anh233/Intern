import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('account')
export class AccountEntity {
    @PrimaryColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column({name: 'phone_number'})
    phonenumber: string;

    @Column({name: 'role_id'})
    roleid: number;

    @Column({name: 'is_active'})
    isactive: number;

    @Column({name: 'update_at'})
    updateat: string;

    @Column({name: 'update_by'})
    updateby: number;

    @Column({name: 'deleted_at'})
    deletedat: string;

    @Column({name: 'deleted_by'})
    deletedby: number;
}
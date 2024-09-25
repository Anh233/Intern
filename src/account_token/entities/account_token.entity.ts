import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('account_token')
export class AccountTokenEntity{
    @PrimaryColumn()
    id: number;

    @Column()
    account_id: number;

    @Column({name: 'token_key'})
    tokenkey: string;

    @Column({name:'is_active'})
    isactive: number;

    @Column({name:'created_at'})
    createdat: Date;

    @Column({name: 'created_by'})
    createdby: number;

    @Column({name: 'updated_at'})
    updatedat: Date;

    @Column({name: 'updated_by'})
    updatedby: number;

    @Column({name: 'deleted_at'})
    deletedat: Date;

    @Column({name: 'deleted_by'})
    deletedby: number;
}
/* eslint-disable */
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm'
import { IAssistant } from '../../Interface'

@Entity()
export class Assistant implements IAssistant {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ nullable: true })
    createdBy: string

    @Column({ nullable: true })
    orgId: string

    @Column({ type: 'text' })
    details: string

    @Column()
    credential: string

    @Column({ nullable: true })
    iconSrc?: string

    @CreateDateColumn()
    createdDate: Date

    @UpdateDateColumn()
    updatedDate: Date
}

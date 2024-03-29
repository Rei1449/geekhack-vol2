"""create tables

Revision ID: bbd0673cdb17
Revises: 4b1b93ec2bf8
Create Date: 2024-03-21 00:23:00.259056+09:00

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bbd0673cdb17'
down_revision = '4b1b93ec2bf8'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('scores', sa.Column('created_at', sa.DateTime(), nullable=False))
    op.add_column('scores', sa.Column('updated_at', sa.DateTime(), nullable=False))
    op.create_foreign_key(None, 'scores', 'users', ['user_name'], ['name'])
    op.add_column('users', sa.Column('created_at', sa.DateTime(), nullable=False))
    op.add_column('users', sa.Column('updated_at', sa.DateTime(), nullable=False))
    # op.drop_constraint('users_name_key', 'users', type_='unique')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint('users_name_key', 'users', ['name'])
    op.drop_column('users', 'updated_at')
    op.drop_column('users', 'created_at')
    op.drop_constraint(None, 'scores', type_='foreignkey')
    op.drop_column('scores', 'updated_at')
    op.drop_column('scores', 'created_at')
    # ### end Alembic commands ###

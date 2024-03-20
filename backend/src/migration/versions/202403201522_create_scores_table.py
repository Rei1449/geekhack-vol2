"""create scores table

Revision ID: 4b1b93ec2bf8
Revises: 4da888d8cf00
Create Date: 2024-03-20 15:22:14.223913+09:00

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4b1b93ec2bf8'
down_revision = '4da888d8cf00'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'scores',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('user_name', sa.String(50), nullable=False),
        sa.Column('score', sa.Numeric, nullable=False),
        sa.Column('hand', sa.Text(), nullable=False),
    )

def downgrade():
    op.drop_table('scores')

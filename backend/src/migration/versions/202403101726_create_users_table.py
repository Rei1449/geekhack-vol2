"""create users table

Revision ID: 4da888d8cf00
Revises: 
Create Date: 2024-03-10 17:26:12.623323+09:00

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4da888d8cf00'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'users',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('name', sa.String(50), nullable=False, unique=True),
        sa.Column('password', sa.Text(), nullable=False),
    )

def downgrade():
    op.drop_table('users')

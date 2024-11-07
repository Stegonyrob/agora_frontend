import React, { useState } from 'react';
import { Card, Container, Row } from 'react-bootstrap';
import { Post } from 'types';
import PostForm from '../../../Generals/Input/button/create/modal/PostForm';
import AvatarComponent from './AvatarComponent';

import styles from './CardUser.module.scss';

interface UserProfileProps {
  id: string;
  name: string;
  avatar_url: string;
  title: string;
  skills: {
    icon: string;
    description: string;
  }[];
}

const UserProfile: React.FC<UserProfileProps> = ({
  id,
  name,
  avatar_url,
  title,
  skills,
}) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const onsubmit = async (post: Post): Promise<void> => {
    // Tu código para manejar la presentación del post
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Container>
      <Row>

        <Card className={styles.userCard}>
          <AvatarComponent avatar={''} />
          <Card.Body>
            <Card.Title>{name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {title}
            </Card.Subtitle>
            <Card.Text>
              {skills.map((skill, index) => (
                <div key={index}>
                  <img src={skill.icon} alt={skill.description} />
                  {skill.description}
                </div>
              ))}
            </Card.Text>
          </Card.Body>
          <PostForm onSubmit={onsubmit} onClose={function (): void {
            throw new Error('Function not implemented.');
          }} />
        </Card>

      </Row>

    </Container>
  );
};

export default UserProfile;
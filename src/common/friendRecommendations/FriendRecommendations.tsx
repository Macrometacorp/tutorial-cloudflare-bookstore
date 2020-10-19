import { API } from '../../apiCalls';
import React from 'react';
import { FriendThumb } from './FriendThumb';

interface FriendRecommendationsProps {
  bookId: string;
}

interface FriendRecommendationsState {
  friends: any[];
}

class FriendRecommendations extends React.Component<FriendRecommendationsProps, FriendRecommendationsState> {
  constructor(props: FriendRecommendationsProps) {
    super(props);

    this.state = {
      friends: []
    };
  }

  getFriends = () => {
    return API.get("recommendations", `/recommendations/${this.props.bookId}`, null);
  }

  async componentDidMount() {
    try {
      const friends = await this.getFriends();
      this.setState({ friends });
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    // No recommendations to show
    if (!this.state.friends[0]) {
      return <div className="no-friends-padding" />
    }
    
    const numFriendsPurchased = this.state.friends.length;
    const friends = this.state.friends;
    return (
      <div>
        <div>Friends who bought this book</div>
        <p>
          {friends.slice(0, 3).map((friend: any) => <FriendThumb key={friend} />)}
          {numFriendsPurchased > 3 && <span className="orange">{` +${numFriendsPurchased - 3} ${(numFriendsPurchased - 3) > 1 ? "others" : "other"}`}</span>}
        </p>
      </div>
    );
  }
}

export default FriendRecommendations;
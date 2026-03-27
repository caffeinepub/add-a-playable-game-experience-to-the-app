import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type ScoreEntry = {
    user : Principal;
    highScore : Nat;
  };

  module ScoreEntry {
    public func compareByScore(a : ScoreEntry, b : ScoreEntry) : Order.Order {
      Nat.compare(b.highScore, a.highScore); // Descending order
    };
  };

  let scores = Map.empty<Principal, Nat>();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public shared ({ caller }) func saveScore(score : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be a signed-in user to save scores");
    };
    switch (scores.get(caller)) {
      case (?currentScore) {
        if (score > currentScore) {
          scores.add(caller, score);
        };
      };
      case (null) { scores.add(caller, score) };
    };
  };

  public query ({ caller }) func getScore(user : Principal) : async Nat {
    // Public leaderboard - anyone can view any user's score
    switch (scores.get(user)) {
      case (?score) { score };
      case (null) { 0 };
    };
  };

  public query ({ caller }) func getCallerScore() : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be a signed-in user to view your score");
    };
    switch (scores.get(caller)) {
      case (?score) { score };
      case (null) { 0 };
    };
  };

  public query ({ caller }) func getLeaderboard(limit : Nat) : async [ScoreEntry] {
    // Public leaderboard - anyone can view
    let entries = scores.entries().toArray();
    let scoreEntries = entries.map(func((user, highScore)) { { user; highScore } });
    let sortedEntries = scoreEntries.sort(ScoreEntry.compareByScore);
    sortedEntries.sliceToArray(0, Nat.min(limit, sortedEntries.size()));
  };
};

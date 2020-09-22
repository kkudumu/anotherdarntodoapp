import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  TextInput,
  Keyboard,
  Animated,
  Modal,
  Dimensions,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import colors from "./../Colors";
import { Swipeable } from "react-native-gesture-handler";
import SubTodoModal from "./SubTodoModal";

const screenWidth = Math.round(Dimensions.get("window").width);

export default class TodoModal extends React.Component {
  state = {
    newTodo: "",
    onTap: 0,
    subTodo: "",
    modalOpen: false,
  };

  toggleTodoCompleted = (index) => {
    let list = this.props.list;

    if (list.todos[index].onTap === 0) {
      list.todos[index].onTap++;
      this.setState({ onTap: 1 });
      list.todos[index].isPending = !list.todos[index].isPending;
    } else if (this.state.onTap === 1) {
      list.todos[index].onTap++;
      this.setState({ onTap: 2 });
      list.todos[index].isPending = false;
      list.todos[index].completed = !list.todos[index].completed;
    } else if (this.state.onTap === 2) {
      list.todos[index].onTap--;
      list.todos[index].onTap--;
      this.setState({ onTap: 0 });
      list.todos[index].completed = false;
      list.todos[index].isPending = false;
    }

    this.props.updateList(list);
  };

  addTodo = () => {
    let list = this.props.list;

    if (!list.todos.some((todo) => todo.title === this.state.newTodo)) {
      list.todos.push({
        title: this.state.newTodo,
        isPending: false,
        completed: false,
        onTap: 0,
        subTodo: "",
      });

      this.props.updateList(list);
    }

    this.setState({ newTodo: "" });

    Keyboard.dismiss();
  };
  //Working on the logic here.
  addSubTodo = (index) => {
    let list = this.props.list;

    this.setState({ subTodo: this.state.subTodo });

    list.todos[index].subTodo = this.state.subTodo;
    // list.todos.splice(list.todos[index].subTodo, 0, {
    //   subTodo: this.state.subTodo,
    // });
    console.log(list.todos[index].title);
    console.log(this.state.subTodo);
    this.props.updateList(list);
    this.setState({ subTodo: "" });
    this.triggerSubTodoModal();
    console.log("pressed!");
  };

  deleteTodo = (index) => {
    let list = this.props.list;
    list.todos.splice(index, 1);

    this.props.updateList(list);
  };

  triggerSubTodoModal = () => {
    if (this.state.modalOpen === false) {
      this.setState({ modalOpen: true });
    } else {
      this.setState({ modalOpen: false });
    }
  };

  renderTodo = (todo, index) => {
    const list = this.props.list;
    return (
      <Swipeable
        renderRightActions={(_, dragX) => this.rightActions(dragX, index)}
      >
        <View
          style={[
            styles.todoContainer,
            {
              overflow: "hidden",
            },
          ]}
        >
          {/* Add Note Modal */}
          <Modal visible={this.state.modalOpen} animationType="slide">
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
              <SafeAreaView style={styles.container}>
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    top: 64,
                    right: 32,
                    zIndex: 10,
                  }}
                  onPress={() => this.triggerSubTodoModal()}
                >
                  <AntDesign name="close" size={24} color={colors.black} />
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    marginBottom: 15,
                  }}
                >
                  Add a Note
                </Text>
                <TextInput
                  style={{
                    color: colors.black,
                    borderColor: list.color,
                    borderWidth: 2,
                    height: 40,
                    width: screenWidth / 1.2,
                  }}
                  onChangeText={(text) => this.setState({ subTodo: text })}
                  value={this.state.subTodo}
                />
                {/* Add button that closes modal and pushes state to firebase for current todo, also, if X is clicked, reset state to ""*/}
                <TouchableOpacity
                  style={[styles.create, { backgroundColor: list.color }]}
                  onPress={() => this.addSubTodo(index)}
                >
                  <Text
                    style={{
                      color: colors.white,
                      fontWeight: "800",
                    }}
                  >
                    Add!
                  </Text>
                </TouchableOpacity>
              </SafeAreaView>
            </KeyboardAvoidingView>
          </Modal>

          <TouchableOpacity onPress={() => this.toggleTodoCompleted(index)}>
            <Ionicons
              name={todo.completed ? "ios-square" : "ios-square-outline"}
              size={24}
              color={colors.gray}
              style={{ width: 32 }}
            />
          </TouchableOpacity>

          <Text
            style={[
              styles.todo,
              {
                textDecorationLine: todo.completed ? "line-through" : "none",
                color: todo.isPending
                  ? "#fc7303"
                  : todo.completed
                  ? colors.gray
                  : colors.black,
              },
            ]}
          >
            {todo.title}
          </Text>
        </View>

        <View
          style={[
            styles.todoSubtitle,
            {
              borderBottomWidth: "1px",
              borderBottomColor: list.color,
              overflow: "hidden",
            },
          ]}
        >
          <Text
            style={[
              styles.todo,
              {
                textDecorationLine: todo.completed ? "line-through" : "none",
                color: todo.isPending
                  ? "#fc7303"
                  : todo.completed
                  ? colors.gray
                  : colors.gray,
              },
            ]}
          >
            {`\t \u2022`}
            {todo.subTodo}
          </Text>
        </View>
      </Swipeable>
    );
  };

  rightActions = (dragX, index) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0.9],
      extrapolate: "clamp",
    });

    const opacity = dragX.interpolate({
      inputRange: [-100, -20, 0],
      outputRange: [1, 0.9, 0],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => this.deleteTodo(index)}>
          <Animated.View style={[styles.deleteButton, { opacity: opacity }]}>
            <Animated.Text
              style={{
                color: colors.white,
                fontWeight: "800",
                transform: [{ scale }],
              }}
            >
              Delete
            </Animated.Text>
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.triggerSubTodoModal()}>
          <Animated.View style={[styles.addButton, { opacity: opacity }]}>
            <Animated.Text
              style={{
                color: colors.white,
                fontWeight: "800",
                transform: [{ scale }],
              }}
            >
              Add Note
            </Animated.Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const list = this.props.list;
    const taskCount = list.todos.length;
    const completedCount = list.todos.filter((todo) => todo.completed).length;

    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <SafeAreaView style={styles.container}>
          <TouchableOpacity
            style={{ position: "absolute", top: 64, right: 32, zIndex: 10 }}
            onPress={this.props.closeModal}
          >
            <AntDesign name="close" size={24} color={colors.black} />
          </TouchableOpacity>

          <View
            style={[
              styles.section,
              styles.header,
              { borderBottomColor: list.color },
            ]}
          >
            <View>
              <Text style={styles.title}>{list.name}</Text>
              <Text style={styles.taskCount}>
                {completedCount} of {taskCount} tasks
              </Text>
            </View>
          </View>

          <View style={[styles.section, { flex: 3, marginVertical: 16 }]}>
            <FlatList
              data={list.todos}
              renderItem={({ item, index }) => this.renderTodo(item, index)}
              keyExtractor={(item) => item.title}
              showsVerticalScrollIndicator={false}
            />
          </View>

          <View style={[styles.section, styles.footer]}>
            <TextInput
              style={[styles.input, { borderColor: list.color }]}
              onChangeText={(text) => this.setState({ newTodo: text })}
              value={this.state.newTodo}
            />
            <TouchableOpacity
              style={[styles.addTodo, { backgroundColor: list.color }]}
              onPress={() => this.addTodo()}
            >
              <AntDesign name="plus" size={16} color={colors.white} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  create: {
    marginTop: 24,
    height: 50,
    width: screenWidth / 2,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    alignSelf: "stretch",
  },
  header: {
    justifyContent: "flex-end",
    marginLeft: 64,
    borderBottomWidth: 3,
    paddingTop: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.black,
  },
  taskCount: {
    marginTop: 4,
    marginBottom: 16,
    color: colors.gray,
    fontWeight: "600",
  },
  footer: {
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6,
    marginRight: 8,
    paddingHorizontal: 8,
  },
  addTodo: {
    borderRadius: 4,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  todoContainer: {
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 32,
  },
  todoSubtitle: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 32,
  },
  todo: {
    color: colors.black,
    fontWeight: "700",
    fontSize: 16,
  },

  deleteButton: {
    flex: 1,
    backgroundColor: colors.red,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
  },
  addButton: {
    flex: 1,
    backgroundColor: colors.blue,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  isPending: {
    color: "#fc8803",
  },
});
